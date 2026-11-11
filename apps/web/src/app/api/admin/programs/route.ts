import type { NextRequest } from 'next/server';
import { ProgramSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  ADMIN_PROGRAM_ERRORS,
  createProgramRecord,
  validateAdminProgram,
} from '@/server/admin-programs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
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

  const parsed = ProgramSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: 'Periksa kembali isi informasi' }, { status: 400 });
  let validationError: string | null;
  try {
    validationError = await validateAdminProgram(parsed.data);
  } catch {
    return Response.json({ error: 'Rujukan wilayah belum dapat diperiksa' }, { status: 503 });
  }
  if (validationError) return Response.json({ error: validationError }, { status: 400 });

  try {
    await createProgramRecord(parsed.data);
    return Response.json({ created: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === ADMIN_PROGRAM_ERRORS.alreadyExists) {
      return Response.json({ error: 'ID informasi sudah digunakan' }, { status: 409 });
    }
    if (message === ADMIN_PROGRAM_ERRORS.unavailable) {
      return Response.json({ error: 'Penyimpanan informasi belum dikonfigurasi' }, { status: 503 });
    }
    return Response.json({ error: 'Informasi belum berhasil disimpan' }, { status: 503 });
  }
}
