import { createClient } from '@supabase/supabase-js';
import { ObstacleReportSchema } from '@hakkita/schema';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { checkObstacleReportRateLimit } from '@/server/obstacle-report-rate-limit';

interface TurnstileResponse {
  success: boolean;
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim().slice(0, 100) || 'unknown';
}

export async function POST(request: NextRequest) {
  const retryAfter = checkObstacleReportRateLimit(getClientKey(request), Date.now());
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'Batas laporan sementara tercapai. Coba lagi nanti.' },
      { status: 429, headers: { 'Retry-After': `${retryAfter}` } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Isi laporan tidak valid.' }, { status: 400 });
  }

  const parsed = ObstacleReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Isi laporan tidak valid.' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!url || !serviceRoleKey || !turnstileSecret) {
    return NextResponse.json({ error: 'Pengiriman laporan belum tersedia.' }, { status: 503 });
  }

  const turnstileBody = new URLSearchParams({
    secret: turnstileSecret,
    response: parsed.data.turnstileToken,
  });

  let turnstile: TurnstileResponse;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: turnstileBody,
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error('Turnstile verification unavailable');
    turnstile = (await response.json()) as TurnstileResponse;
  } catch {
    return NextResponse.json({ error: 'Verifikasi belum dapat dilakukan. Coba lagi nanti.' }, { status: 503 });
  }

  if (turnstile.success !== true) {
    return NextResponse.json({ error: 'Verifikasi gagal. Coba ulangi.' }, { status: 400 });
  }

  try {
    const supabase = createClient<Database>(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from('obstacle_reports').insert({
      program_id: parsed.data.programId,
      stage: parsed.data.stage,
      region_code: parsed.data.regionCode,
    });
    if (error) {
      return NextResponse.json(
        { error: 'Laporan belum dapat disimpan. Coba lagi nanti.' },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json({ error: 'Laporan belum dapat disimpan. Coba lagi nanti.' }, { status: 503 });
  }

  return NextResponse.json({ accepted: true }, { status: 201 });
}
