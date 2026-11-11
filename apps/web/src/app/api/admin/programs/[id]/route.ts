import type { NextRequest } from 'next/server';
import { ProgramSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import {
  ADMIN_PROGRAM_ERRORS,
  deleteProgramRecord,
  updateProgramRecord,
  validateAdminProgram,
} from '@/server/admin-programs';
import type { AdminProgramRouteContext } from './types';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: AdminProgramRouteContext) {
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
  const { id } = await params;
  if (parsed.data.id !== id)
    return Response.json({ error: 'ID informasi tidak cocok' }, { status: 400 });
  let validationError: string | null;
  try {
    validationError = await validateAdminProgram(parsed.data);
  } catch {
    return Response.json({ error: 'Rujukan wilayah belum dapat diperiksa' }, { status: 503 });
  }
  if (validationError) return Response.json({ error: validationError }, { status: 400 });

  try {
    await updateProgramRecord(id, parsed.data);
    return Response.json({ updated: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === ADMIN_PROGRAM_ERRORS.notFound) {
      return Response.json({ error: 'Informasi tidak ditemukan' }, { status: 404 });
    }
    if (message === ADMIN_PROGRAM_ERRORS.kindMismatch) {
      return Response.json(
        { error: 'Jenis informasi tidak dapat diubah setelah dibuat' },
        { status: 409 },
      );
    }
    if (message === ADMIN_PROGRAM_ERRORS.unavailable) {
      return Response.json({ error: 'Penyimpanan informasi belum dikonfigurasi' }, { status: 503 });
    }
    return Response.json({ error: 'Perubahan belum berhasil disimpan' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, { params }: AdminProgramRouteContext) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await deleteProgramRecord(id);
    return Response.json({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === ADMIN_PROGRAM_ERRORS.notFound) {
      return Response.json({ error: 'Informasi tidak ditemukan' }, { status: 404 });
    }
    if (message === ADMIN_PROGRAM_ERRORS.unavailable) {
      return Response.json({ error: 'Penyimpanan informasi belum dikonfigurasi' }, { status: 503 });
    }
    return Response.json({ error: 'Informasi belum berhasil dihapus' }, { status: 503 });
  }
}
