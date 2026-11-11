import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { ADMIN_PROGRAM_ERRORS, createProgramRecord, updateProgramRecord } from './admin-programs';

const createClient = vi.hoisted(() => vi.fn());
vi.mock('server-only', () => ({}));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

function configureDatabaseClient(from: (table: string) => unknown) {
  createClient.mockReturnValue({ from });
}

describe('admin information persistence', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createClient.mockReset();
  });

  it('creates a public service in its dedicated table', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));
    configureDatabaseClient(from);
    const service = makeProgram({
      id: 'ktp-el',
      nama: 'Pengurusan KTP-el',
      jenis: 'layanan',
      kategori: 'Kependudukan & Dokumen Pribadi',
      tipeGerbang: 'prosedur',
    });

    await createProgramRecord(service);

    expect(from).toHaveBeenCalledWith('public_services');
    expect(insert).toHaveBeenCalledWith({ id: service.id, record: service });
  });

  it('updates services in their dedicated table', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: 'ktp-el' }, error: null });
    const select = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));
    configureDatabaseClient(from);
    const service = makeProgram({
      id: 'ktp-el',
      nama: 'Pengurusan KTP-el',
      jenis: 'layanan',
      kategori: 'Kependudukan & Dokumen Pribadi',
      tipeGerbang: 'prosedur',
    });

    await updateProgramRecord(service.id, service);

    expect(from).toHaveBeenCalledWith('public_services');
    expect(update).toHaveBeenCalledWith({
      record: service,
      updated_at: expect.any(String),
    });
  });

  it('does not move an existing record to the other table when its kind changes', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    const maybeSingle = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: { id: 'ktp-el' }, error: null });
    const lookupQuery = { select: vi.fn(), eq: vi.fn(), maybeSingle };
    lookupQuery.select.mockReturnValue(lookupQuery);
    lookupQuery.eq.mockReturnValue(lookupQuery);
    const updateQuery = { update: vi.fn(), eq: vi.fn(), select: vi.fn(), maybeSingle };
    updateQuery.update.mockReturnValue(updateQuery);
    updateQuery.eq.mockReturnValue(updateQuery);
    updateQuery.select.mockReturnValue(updateQuery);
    const from = vi.fn((table: string) => (table === 'programs' ? updateQuery : lookupQuery));
    configureDatabaseClient(from);
    const program = makeProgram({ id: 'ktp-el' });

    await expect(updateProgramRecord(program.id, program)).rejects.toThrow(
      ADMIN_PROGRAM_ERRORS.kindMismatch,
    );
    expect(from).toHaveBeenNthCalledWith(1, 'programs');
    expect(from).toHaveBeenNthCalledWith(2, 'public_services');
  });
});
