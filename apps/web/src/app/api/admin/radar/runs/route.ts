import { after } from 'next/server';
import type { NextRequest } from 'next/server';
import { RadarRunStartSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  RADAR_RUN_ERRORS,
  loadLatestRadarRun,
  runRadarSlice,
  startRadarRun,
} from '@/server/radar-run-jobs';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function unavailable() {
  return Response.json(
    { error: 'Proses latar belakang belum tersedia.', code: 'runs-unavailable' },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  try {
    const latest = await loadLatestRadarRun();
    if (latest?.isResumable) {
      const { origin } = request.nextUrl;
      after(() => runRadarSlice(latest.snapshot.id, origin));
    }
    return Response.json({ run: latest?.snapshot ?? null });
  } catch (error) {
    if (error instanceof Error && error.message === RADAR_RUN_ERRORS.unavailable) {
      return unavailable();
    }
    return Response.json({ error: 'Status Radar belum dapat dimuat' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const adminId = await getRadarAdminId();
  if (!adminId) return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 1000) {
      return Response.json({ error: 'Isi terlalu panjang' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = RadarRunStartSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: 'Perintah Radar tidak valid' }, { status: 400 });

  try {
    const { id, state } = await startRadarRun(parsed.data.kind, adminId);
    const { origin } = request.nextUrl;
    after(() => runRadarSlice(id, origin));
    return Response.json({ run: { id, state, finishedAt: null } }, { status: 202 });
  } catch (error) {
    if (error instanceof Error && error.message === RADAR_RUN_ERRORS.unavailable) {
      return unavailable();
    }
    if (error instanceof Error && error.message === RADAR_RUN_ERRORS.alreadyRunning) {
      return Response.json(
        { error: 'Radar masih berjalan. Tunggu sampai selesai.', code: 'run-active' },
        { status: 409 },
      );
    }
    return Response.json(
      { error: 'Radar gagal dijalankan. Periksa konfigurasi dan coba lagi.' },
      { status: 503 },
    );
  }
}
