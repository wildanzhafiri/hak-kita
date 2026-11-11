import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { buildWilayahIndex, checkProgram, todayWIB } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { loadWilayahFile } from './data';

export const ADMIN_PROGRAM_ERRORS = {
  alreadyExists: 'PROGRAM_ALREADY_EXISTS',
  notFound: 'PROGRAM_NOT_FOUND',
  kindMismatch: 'PROGRAM_KIND_IMMUTABLE',
  unavailable: 'PROGRAM_STORAGE_UNAVAILABLE',
} as const;

export function isProgramManagementConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function validateAdminProgram(program: Program): Promise<string | null> {
  const result = checkProgram(program, { today: todayWIB() });
  if (result.errors.length > 0) return result.errors.join('. ');
  const wilayahFile = await loadWilayahFile();
  const wilayah = buildWilayahIndex(wilayahFile.wilayah).get(program.cakupan.kode);
  if (!wilayah || wilayah.level !== program.cakupan.level) {
    return 'Kode wilayah tidak ditemukan atau tidak sesuai cakupan';
  }
  return null;
}

function createProgramDatabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error(ADMIN_PROGRAM_ERRORS.unavailable);
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function createProgramRecord(program: Program): Promise<void> {
  const client = createProgramDatabaseClient();
  const { error } =
    program.jenis === 'layanan'
      ? await client.from('public_services').insert({ id: program.id, record: program })
      : await client.from('programs').insert({ id: program.id, record: program });
  if (error?.code === '23505') throw new Error(ADMIN_PROGRAM_ERRORS.alreadyExists);
  if (error) throw error;
}

export async function updateProgramRecord(programId: string, program: Program): Promise<void> {
  const client = createProgramDatabaseClient();
  const { data, error } =
    program.jenis === 'layanan'
      ? await client
          .from('public_services')
          .update({ record: program, updated_at: new Date().toISOString() })
          .eq('id', programId)
          .select('id')
          .maybeSingle()
      : await client
          .from('programs')
          .update({ record: program, updated_at: new Date().toISOString() })
          .eq('id', programId)
          .select('id')
          .maybeSingle();
  if (error) throw error;
  if (!data) {
    const otherKind =
      program.jenis === 'layanan'
        ? await client.from('programs').select('id').eq('id', programId).maybeSingle()
        : await client.from('public_services').select('id').eq('id', programId).maybeSingle();
    if (otherKind.error) throw otherKind.error;
    throw new Error(
      otherKind.data ? ADMIN_PROGRAM_ERRORS.kindMismatch : ADMIN_PROGRAM_ERRORS.notFound,
    );
  }
}

export async function deleteProgramRecord(programId: string): Promise<void> {
  const client = createProgramDatabaseClient();
  const programResult = await client
    .from('programs')
    .delete()
    .eq('id', programId)
    .select('id')
    .maybeSingle();
  if (programResult.error) throw programResult.error;
  if (programResult.data) return;
  const serviceResult = await client
    .from('public_services')
    .delete()
    .eq('id', programId)
    .select('id')
    .maybeSingle();
  if (serviceResult.error) throw serviceResult.error;
  if (!serviceResult.data) throw new Error(ADMIN_PROGRAM_ERRORS.notFound);
}
