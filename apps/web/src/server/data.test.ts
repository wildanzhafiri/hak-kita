import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { loadAllInformation, loadPrograms, loadPublicServices } from './data';

const createClient = vi.hoisted(() => vi.fn());
vi.mock('server-only', () => ({}));
vi.mock('@supabase/supabase-js', () => ({ createClient }));

function mockInformationTables() {
  const program = makeProgram({ id: 'program-contoh' });
  const service = makeProgram({
    id: 'layanan-contoh',
    nama: 'Layanan Contoh',
    jenis: 'layanan',
    kategori: 'Kependudukan & Dokumen Pribadi',
    tipeGerbang: 'prosedur',
  });
  const records = {
    programs: [{ id: program.id, record: program }],
    public_services: [{ id: service.id, record: service }],
  };
  createClient.mockReturnValue({
    from: (table: keyof typeof records) => ({
      select: () => ({
        order: async () => ({ data: records[table], error: null }),
      }),
    }),
  });
  return { program, service };
}

describe('information data loading', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createClient.mockReset();
  });

  it('loads program and service records from their separate tables for the admin list', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    vi.stubEnv('DEMO_OFFLINE', 'false');
    const { program, service } = mockInformationTables();

    await expect(loadAllInformation()).resolves.toEqual([program, service]);
  });

  it('keeps the public program and service catalogs separate', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    vi.stubEnv('DEMO_OFFLINE', 'false');
    const { program, service } = mockInformationTables();

    await expect(loadPrograms()).resolves.toEqual([program]);
    await expect(loadPublicServices()).resolves.toEqual([service]);
  });
});
