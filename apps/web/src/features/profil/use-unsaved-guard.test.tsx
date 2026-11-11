import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUnsavedGuard } from './use-unsaved-guard';

const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => router }));

function Harness({ isDirty }: { isDirty: boolean }) {
  const guard = useUnsavedGuard(isDirty);
  return (
    <div>
      <a href="/rencanaku">Rencanaku</a>
      <a href="/profil/edit#bagian">Bagian sama</a>
      <a href="https://contoh.id/luar">Situs luar</a>
      <a href="/rencanaku" target="_blank">
        Tab baru
      </a>
      <button onClick={() => guard.requestLeave('/profil')} type="button">
        Batal
      </button>
      <button onClick={guard.leave} type="button">
        Tinggalkan
      </button>
      <button onClick={guard.stay} type="button">
        Tetap
      </button>
      <p>{guard.isLeaving ? 'menunggu' : 'tenang'}</p>
    </div>
  );
}

describe('useUnsavedGuard', () => {
  beforeEach(() => {
    router.push.mockReset();
    window.history.replaceState(null, '', '/profil/edit');
  });

  it('lets links through while nothing has changed', () => {
    render(<Harness isDirty={false} />);

    fireEvent.click(screen.getByRole('link', { name: 'Rencanaku' }));

    expect(screen.getByText('tenang')).toBeTruthy();
  });

  it('holds an internal link while there are unsaved changes, and leaves on confirmation', () => {
    render(<Harness isDirty />);

    fireEvent.click(screen.getByRole('link', { name: 'Rencanaku' }));
    expect(screen.getByText('menunggu')).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Tinggalkan' }));

    expect(router.push).toHaveBeenCalledWith('/rencanaku');
    expect(screen.getByText('tenang')).toBeTruthy();
  });

  it('stays on the page when the person chooses to keep editing', () => {
    render(<Harness isDirty />);

    fireEvent.click(screen.getByRole('link', { name: 'Rencanaku' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tetap' }));

    expect(router.push).not.toHaveBeenCalled();
    expect(screen.getByText('tenang')).toBeTruthy();
  });

  it('ignores links that stay on the page, leave the site, or open a new tab', () => {
    render(<Harness isDirty />);

    fireEvent.click(screen.getByRole('link', { name: 'Bagian sama' }));
    fireEvent.click(screen.getByRole('link', { name: 'Situs luar' }));
    fireEvent.click(screen.getByRole('link', { name: 'Tab baru' }));

    expect(screen.getByText('tenang')).toBeTruthy();
  });

  it('asks before cancelling when dirty and goes straight away when clean', () => {
    const { rerender } = render(<Harness isDirty />);
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(screen.getByText('menunggu')).toBeTruthy();
    expect(router.push).not.toHaveBeenCalled();

    rerender(<Harness isDirty={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tetap' }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(router.push).toHaveBeenCalledWith('/profil');
  });

  it('warns the browser before the tab is closed while dirty', () => {
    render(<Harness isDirty />);
    const event = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
