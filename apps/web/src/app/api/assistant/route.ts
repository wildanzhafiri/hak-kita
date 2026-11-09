import { createServerClient } from '@supabase/ssr';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, stepCountIs, streamText, validateUIMessages } from 'ai';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { AssistantRequestSchema, MAX_ASSISTANT_USER_TEXT_LENGTH } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { createAssistantTools, getAssistantPageContext } from '@/server/assistant';
import { checkAssistantRateLimit } from '@/server/assistant-rate-limit';
import { ASSISTANT_INSTRUCTIONS } from '@/server/content';

const REQUEST_BODY_LIMIT = 60_000;

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim().slice(0, 100) || 'unknown';
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > REQUEST_BODY_LIMIT) {
    return NextResponse.json({ error: 'Pesan terlalu panjang.' }, { status: 413 });
  }

  const retryAfter = checkAssistantRateLimit(getClientKey(request), Date.now());
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'Batas pesan sementara tercapai. Coba lagi sebentar.' },
      { status: 429, headers: { 'Retry-After': `${retryAfter}` } },
    );
  }

  let body: unknown;
  try {
    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > REQUEST_BODY_LIMIT) {
      return NextResponse.json({ error: 'Percakapan terlalu panjang.' }, { status: 413 });
    }
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'Pesan tidak dapat dibaca.' }, { status: 400 });
  }

  const parsed = AssistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Pesan tidak valid.' }, { status: 400 });
  }

  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_GATEWAY_BASE_URL;
  const model = process.env.AI_GATEWAY_MODEL;
  const approvalSecret = process.env.TOOL_APPROVAL_SECRET;
  const databaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!apiKey || !baseURL || !model || !approvalSecret) {
    return NextResponse.json({ error: 'Asisten belum dikonfigurasi.' }, { status: 503 });
  }

  let accountClient: ReturnType<typeof createServerClient<Database>> | null = null;
  let userId: string | null = null;
  if (databaseUrl && publishableKey) {
    const cookieStore = await cookies();
    accountClient = createServerClient<Database>(databaseUrl, publishableKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    });
    const { data } = await accountClient.auth.getUser();
    userId = data.user?.id ?? null;
  }

  try {
    const tools = createAssistantTools(accountClient, userId);
    const uiMessages = await validateUIMessages({ messages: parsed.data.messages, tools });
    const hasLongUserMessage = uiMessages
      .filter((message) => message.role === 'user')
      .some(
        (message) =>
          message.parts.reduce(
            (length, part) => (part.type === 'text' ? length + part.text.length : length),
            0,
          ) > MAX_ASSISTANT_USER_TEXT_LENGTH,
      );
    if (hasLongUserMessage) {
      return NextResponse.json(
        { error: 'Percakapan terlalu panjang. Mulai percakapan baru.' },
        { status: 413 },
      );
    }

    const gateway = createOpenAICompatible({ name: 'menvora', baseURL, apiKey });
    const pageContext = await getAssistantPageContext(parsed.data.currentPath);
    const result = streamText({
      model: gateway.chatModel(model),
      system: userId
        ? `${ASSISTANT_INSTRUCTIONS}\n\n${pageContext}`
        : `${ASSISTANT_INSTRUCTIONS}\n\n${pageContext}\n\nPengguna belum masuk. Jawab pertanyaan umum dari data publik seperti biasa tanpa meminta pengguna masuk. Jangan panggil getMyPlan atau saveProgramToPlan dan jangan menyiratkan bahwa kamu dapat melihat data akun pengguna. Jika ditanya tentang Rencanaku atau data akun lain, jelaskan bahwa kamu tidak dapat mengaksesnya sebelum pengguna masuk. Menyimpan program ke Rencanaku juga memerlukan akun.`,
      messages: await convertToModelMessages(uiMessages, { tools }),
      tools,
      toolApproval: { saveProgramToPlan: 'user-approval' },
      experimental_toolApprovalSecret: approvalSecret,
      stopWhen: stepCountIs(5),
      abortSignal: request.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return NextResponse.json(
      { error: 'Asisten belum dapat menjawab. Coba lagi sebentar.' },
      { status: 503 },
    );
  }
}
