import type { NextRequest } from 'next/server';
import { ProgramEmailRequestSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  previewProgramUpdate,
  runProgramEmailNotifications,
} from '@/server/program-email-notifications';
import type { AdminProgramRouteContext } from '../types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_BODY_BYTES = 2000;

export async function GET(_request: NextRequest, { params }: AdminProgramRouteContext) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  const { id } = await params;
  try {
    return Response.json(await previewProgramUpdate(id));
  } catch {
    return Response.json({ error: 'Pratinjau email belum dapat dimuat' }, { status: 503 });
  }
}

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
  const parsed = ProgramEmailRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Pesan tambahan maksimal 600 karakter.' }, { status: 400 });
  }
  const { id } = await params;
  const { action, note } = parsed.data;
  try {
    if (action === 'preview') return Response.json(await previewProgramUpdate(id, note));
    const result = await runProgramEmailNotifications({ onlyProgramId: id, note });
    return Response.json(result, { status: result.failed > 0 ? 503 : 200 });
  } catch {
    return Response.json(
      { error: 'Pengiriman belum selesai. Periksa konfigurasi email lalu coba lagi.' },
      { status: 503 },
    );
  }
}
