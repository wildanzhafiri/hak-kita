import type { NextRequest } from 'next/server';
import { RadarRunActionSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import { dismissRadarRun, requestRadarRunStop } from '@/server/radar-run-jobs';

export const dynamic = 'force-dynamic';

interface RadarRunRouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RadarRunRouteContext) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 403 });
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = RadarRunActionSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: 'Perintah Radar tidak valid' }, { status: 400 });

  try {
    if (parsed.data.action === 'stop') await requestRadarRunStop(id);
    else await dismissRadarRun(id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Perintah belum dapat diproses' }, { status: 503 });
  }
}
