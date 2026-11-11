import { after } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRadarAdminId } from '@/server/admin-access';
import { runRadarSlice } from '@/server/radar-run-jobs';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface RadarRunContinueContext {
  params: Promise<{ id: string }>;
}

function hasCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function POST(request: NextRequest, { params }: RadarRunContinueContext) {
  if (!hasCronSecret(request) && !(await getRadarAdminId())) {
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const { origin } = request.nextUrl;
  after(() => runRadarSlice(id, origin));
  return Response.json({ accepted: true }, { status: 202 });
}
