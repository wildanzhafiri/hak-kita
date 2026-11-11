import type { NextRequest } from 'next/server';
import { ProgramSchema, RadarProgramReviewRequestSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import { validateAdminProgram } from '@/server/admin-programs';
import {
  loadPendingDiscoveredPrograms,
  reviewDiscoveredProgram,
} from '@/server/radar-program-discovery';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  try {
    return Response.json({ candidates: await loadPendingDiscoveredPrograms() });
  } catch {
    return Response.json({ error: 'Antrean program baru belum dapat dimuat' }, { status: 503 });
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
    if (new TextEncoder().encode(text).byteLength > 40_000) {
      return Response.json({ error: 'Isi terlalu panjang' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = RadarProgramReviewRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Isi tinjauan tidak valid' }, { status: 400 });

  try {
    let program = null;
    if (parsed.data.action === 'approve') {
      const validated = ProgramSchema.safeParse(parsed.data.program);
      if (!validated.success || validated.data.verifikasi !== 'belum') {
        return Response.json({ error: 'Draf program belum valid' }, { status: 400 });
      }
      const [candidate] = (await loadPendingDiscoveredPrograms()).filter(
        (entry) => entry.id === parsed.data.candidateId,
      );
      if (!candidate) return Response.json({ error: 'Temuan sudah ditinjau' }, { status: 409 });
      const evidenceUrls = new Set(candidate.record.evidence.map((evidence) => evidence.url));
      const sourceUrls = [
        validated.data.sumberUtama.url,
        ...validated.data.sumberTambahan.map((source) => source.url),
        ...validated.data.syarat.flatMap((requirement) =>
          requirement.sumberUrl ? [requirement.sumberUrl] : [],
        ),
      ];
      if (sourceUrls.some((sourceUrl) => !evidenceUrls.has(sourceUrl))) {
        return Response.json(
          { error: 'Sumber program harus berasal dari bukti resmi pada temuan' },
          { status: 400 },
        );
      }
      const validationMessage = await validateAdminProgram(validated.data);
      if (validationMessage) return Response.json({ error: validationMessage }, { status: 400 });
      program = validated.data;
    }
    const programId = await reviewDiscoveredProgram(
      parsed.data.candidateId,
      adminId,
      parsed.data.action,
      program,
    );
    return Response.json({ reviewed: true, programId });
  } catch {
    return Response.json(
      { error: 'Tinjauan gagal disimpan. Muat ulang antrean.' },
      { status: 409 },
    );
  }
}
