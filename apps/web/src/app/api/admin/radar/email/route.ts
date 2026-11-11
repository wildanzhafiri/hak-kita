import type { NextRequest } from 'next/server';
import { RadarEmailSendSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  loadProgramNewsEmailPreview,
  sendApprovedProgramNewsNow,
} from '@/server/program-news-delivery';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  const parsed = RadarEmailSendSchema.safeParse({
    newsId: request.nextUrl.searchParams.get('newsId'),
  });
  if (!parsed.success) return Response.json({ error: 'Kabar email tidak valid' }, { status: 400 });
  try {
    return Response.json(await loadProgramNewsEmailPreview(parsed.data.newsId));
  } catch {
    return Response.json({ error: 'Pratinjau email belum dapat dimuat' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
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
  const parsed = RadarEmailSendSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Kabar email tidak valid' }, { status: 400 });
  try {
    return Response.json(await sendApprovedProgramNewsNow(parsed.data.newsId));
  } catch {
    return Response.json(
      { error: 'Pengiriman belum selesai. Periksa riwayat lalu coba lagi.' },
      { status: 503 },
    );
  }
}
