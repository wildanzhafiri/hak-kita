import type { NextRequest } from 'next/server';
import { todayWIB } from '@hakkita/domain';
import { ProgramSchema, RadarProgramReviewRequestSchema } from '@hakkita/schema';
import type { Program } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import { updateProgramRecord, validateAdminProgram } from '@/server/admin-programs';
import {
  loadPendingDiscoveredPrograms,
  reviewDiscoveredProgram,
  updateDiscoveredProgramDraft,
} from '@/server/radar-program-discovery';

export const dynamic = 'force-dynamic';

const PUBLISHED_VERIFICATION = 'dasar';

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
    let program: Program | null = null;
    let published: Program | null = null;
    if (parsed.data.action !== 'reject') {
      const validated = ProgramSchema.safeParse(parsed.data.program);
      if (!validated.success) {
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
      const pending: Program = {
        ...validated.data,
        verifikasi: 'belum',
        tanggalDiperiksa: undefined,
      };
      if (parsed.data.action === 'update') {
        await updateDiscoveredProgramDraft(parsed.data.candidateId, pending);
        return Response.json({ updated: true, program: pending });
      }
      published = {
        ...validated.data,
        verifikasi: PUBLISHED_VERIFICATION,
        tanggalDiperiksa: todayWIB(),
      };
      const validationMessage = await validateAdminProgram(published);
      if (validationMessage) return Response.json({ error: validationMessage }, { status: 400 });
      program = pending;
    }
    const programId = await reviewDiscoveredProgram(
      parsed.data.candidateId,
      adminId,
      parsed.data.action,
      program,
    );
    if (published && programId) {
      try {
        await updateProgramRecord(programId, published);
      } catch {
        return Response.json(
          {
            error:
              'Disetujui, tetapi belum berhasil dipublikasikan. Buka Kelola Informasi dan atur status verifikasinya.',
          },
          { status: 500 },
        );
      }
    }
    return Response.json({ reviewed: true, programId });
  } catch {
    return Response.json(
      { error: 'Tinjauan gagal disimpan. Muat ulang antrean.' },
      { status: 409 },
    );
  }
}
