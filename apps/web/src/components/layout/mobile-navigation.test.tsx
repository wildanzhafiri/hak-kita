import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileNavigation } from './mobile-navigation';

const mocks = vi.hoisted(() => ({ user: null as { id: string } | null }));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/lib/supabase/client', () => ({ getSupabaseBrowserClient: () => null }));

describe('MobileNavigation', () => {
  beforeEach(() => {
    mocks.user = null;
  });

  it('gives a guest the plan and sign-in actions', () => {
    render(<MobileNavigation pathname="/" />);

    expect(screen.getByRole('link', { name: /Rencanaku/, hidden: true }).getAttribute('href')).toBe(
      '/rencanaku',
    );
    expect(screen.getByRole('link', { name: 'Masuk', hidden: true })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Profil Saya', hidden: true })).toBeNull();
  });

  it('lists profile, plan and sign out under the menu for a signed-in person', () => {
    mocks.user = { id: 'user-1' };
    render(<MobileNavigation pathname="/" />);

    const account = screen.getByRole('navigation', { name: 'Menu akun', hidden: true });
    expect(account.textContent).toContain('Profil Saya');
    expect(account.textContent).toContain('Rencanaku');
    expect(account.textContent).toContain('Keluar');
    expect(screen.queryByRole('link', { name: 'Masuk', hidden: true })).toBeNull();
  });
});
