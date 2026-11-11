import type { NextRequest } from 'next/server';
import { ProgramNewsRequestSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  DuplicateProgramNewsError,
  previewManualProgramNews,
  sendManualProgramNews,
} from '@/server/manual-program-news';
import type { AdminProgramRouteContext } from '../types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_BODY_BYTES = 4000;

export async function POST(request: NextRequest, { params }: AdminProgramRouteContext) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
      return Response.json({ error: 'Isi terlalu panjang' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = ProgramNewsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Periksa judul, ringkasan, tanggal, dan tautan go.id sumber kabar.' },
      { status: 400 },
    );
  }
  const { id } = await params;
  const { action, ...input } = parsed.data;
  try {
    if (action === 'preview') return Response.json(await previewManualProgramNews(id, input));
    const result = await sendManualProgramNews(id, input);
    return Response.json(result, { status: result.failed > 0 ? 503 : 200 });
  } catch (error) {
    if (error instanceof DuplicateProgramNewsError) {
      return Response.json(
        { error: 'Kabar dengan tautan sumber ini sudah pernah dibuat. Gunakan tautan lain.' },
        { status: 409 },
      );
    }
    return Response.json(
      { error: 'Kabar belum dapat diproses. Periksa konfigurasi email lalu coba lagi.' },
      { status: 503 },
    );
  }
}
