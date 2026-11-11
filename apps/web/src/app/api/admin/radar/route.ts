import type { NextRequest } from 'next/server';
import { RadarReviewRequestSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import { loadPendingRadarCandidates, reviewRadarCandidate } from '@/server/radar-review';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  try {
    return Response.json({ candidates: await loadPendingRadarCandidates() });
  } catch {
    return Response.json({ error: 'Antrean Radar belum dapat dimuat' }, { status: 503 });
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
    if (new TextEncoder().encode(text).byteLength > 10_000) {
      return Response.json({ error: 'Isi terlalu panjang' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = RadarReviewRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Isi tinjauan tidak valid' }, { status: 400 });

  try {
    const newsId = await reviewRadarCandidate(parsed.data, adminId);
    return Response.json({ reviewed: true, newsId });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.startsWith('Tanggal') || message.startsWith('Sumber')) {
      return Response.json({ error: message }, { status: 400 });
    }
    return Response.json(
      { error: 'Tinjauan gagal disimpan. Muat ulang antrean.' },
      { status: 409 },
    );
  }
}
