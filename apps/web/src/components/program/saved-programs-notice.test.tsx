import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedProgramsNotice } from './saved-programs-notice';

const { savedState } = vi.hoisted(() => ({
  savedState: { error: null as string | null, retry: vi.fn() },
}));

vi.mock('@/hooks/use-saved-ids', () => ({ useSavedIds: () => savedState }));

describe('SavedProgramsNotice', () => {
  beforeEach(() => {
    savedState.error = null;
    savedState.retry.mockClear();
  });

  it('shows a single notice outside the program cards', () => {
    savedState.error = 'Simpanan akun belum dapat dimuat. Coba lagi.';
    render(<SavedProgramsNotice />);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
    expect(savedState.retry).toHaveBeenCalledOnce();
  });
});
