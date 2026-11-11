import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { ProgramDetail } from './program-detail';

const router = vi.hoisted(() => ({ refresh: vi.fn(), replace: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => router }));

describe('ProgramDetail', () => {
  beforeEach(() => {
    router.refresh.mockReset();
    router.replace.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens the editor for an admin', () => {
    render(<ProgramDetail canManage program={makeProgram()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ubah informasi' }));

    expect(screen.getByRole('heading', { name: 'Ubah informasi' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Simpan perubahan' })).toBeTruthy();
  });

  it('asks for confirmation before deleting an information record', () => {
    render(<ProgramDetail canManage program={makeProgram()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hapus informasi' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText(/data tersimpan dan kabar program yang terhubung/)).toBeTruthy();
  });

  it('deletes the record after an admin confirms', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ deleted: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramDetail canManage program={makeProgram()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hapus informasi' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ya, hapus' }));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/admin/informasi'));
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/programs/contoh', { method: 'DELETE' });
  });
});
