import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BERKAS, BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
import { loadBerkasProgress } from '@/features/berkas/berkas-progress-store';
import { RencanaBerkas } from './rencana-berkas';
import { RencanaProvider } from './rencana-provider';

const mockClient = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => mockClient,
}));
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'rencana-account' }, isReady: true, isConfigured: true }),
}));
vi.mock('@/hooks/use-saved-ids', () => ({
  useSavedIds: () => ({
    ids: [],
    isLoading: false,
    isSaving: false,
    error: null,
    toggle: vi.fn(),
    clear: vi.fn(),
  }),
}));

beforeEach(() => {
  window.localStorage.clear();
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue({
    data: {
      answers: { ekonomi: 'kip' },
      checked_item_ids: ['email'],
      details_updated_at: '2026-11-05T01:00:00.000Z',
      note: 'Tanya operator sekolah',
    },
    error: null,
  });
  mockClient.from.mockReturnValue(query);
});

describe('RencanaBerkas account data', () => {
  it('shows answers, checks, and notes saved on another device', async () => {
    await loadBerkasProgress('rencana-account', 'account-kip');
    render(
      <RencanaProvider
        programs={[makeProgram({ id: 'account-kip', nama: 'KIP Kuliah', berkas: BERKAS })]}
        wilayah={WILAYAH}
        builtOn={BUILT_ON}
      >
        <RencanaBerkas />
      </RencanaProvider>,
    );

    expect(screen.getByText('1 dari 1 dokumen siap')).toBeTruthy();
    expect(screen.getByText('Tanya operator sekolah')).toBeTruthy();
    expect(window.localStorage.getItem('hakkita:berkas:account-kip')).toBeNull();
  });
});
