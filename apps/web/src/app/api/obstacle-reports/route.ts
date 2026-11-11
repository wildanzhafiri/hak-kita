import { createClient } from '@supabase/supabase-js';
import { ObstacleReportSchema } from '@hakkita/schema';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase/types';
import { checkObstacleReportRateLimit } from '@/server/obstacle-report-rate-limit';
import { verifyTurnstileToken } from '@/server/turnstile';

const REQUEST_BODY_LIMIT = 10_000;

function getClientKey(request: NextRequest): string {
  return request.headers.get('x-real-ip')?.trim().slice(0, 100) || 'unknown';
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
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > REQUEST_BODY_LIMIT) {
      return NextResponse.json({ error: 'Isi laporan terlalu panjang.' }, { status: 413 });
    }
    body = JSON.parse(text);
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

  const verification = await verifyTurnstileToken({
    token: parsed.data.turnstileToken,
    secret: turnstileSecret,
    hostname: request.nextUrl.hostname,
    action: 'obstacle_report',
  });
  if (verification === 'unavailable') {
    return NextResponse.json(
      { error: 'Verifikasi belum dapat dilakukan. Coba lagi nanti.' },
      { status: 503 },
    );
  }
  if (verification !== 'valid') {
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
    return NextResponse.json(
      { error: 'Laporan belum dapat disimpan. Coba lagi nanti.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ accepted: true }, { status: 201 });
}
