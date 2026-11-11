import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountMenu } from './account-menu';

const mocks = vi.hoisted(() => ({
  nama: 'Budi Santoso',
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'user-1', email: 'budi@contoh.id' } }),
}));
vi.mock('./use-profile', () => ({
  useProfile: () => ({ nama: mocks.nama }),
}));
vi.mock('@/lib/supabase/client', () => ({ getSupabaseBrowserClient: () => null }));

describe('AccountMenu', () => {
  beforeEach(() => {
    mocks.nama = 'Budi Santoso';
  });

  it('opens a menu with the name, email, profile, plan and sign-out', async () => {
    render(<AccountMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));

    expect(await screen.findByText('Budi Santoso')).toBeTruthy();
    expect(screen.getByText('budi@contoh.id')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Profil Saya' }).getAttribute('href')).toBe('/profil');
    expect(screen.getByRole('link', { name: 'Rencanaku' }).getAttribute('href')).toBe('/rencanaku');
    expect(screen.getByRole('button', { name: /Keluar/ })).toBeTruthy();
  });

  it('shows the email alone when no name was saved', async () => {
    mocks.nama = '';
    render(<AccountMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));

    expect(await screen.findAllByText('budi@contoh.id')).toHaveLength(1);
  });

  it('asks for confirmation before signing out', async () => {
    render(<AccountMenu />);

    fireEvent.click(screen.getByRole('button', { name: 'Menu profil' }));
    fireEvent.click(await screen.findByRole('button', { name: /Keluar/ }));

    expect(await screen.findByRole('dialog', { name: 'Keluar dari akun?' })).toBeTruthy();
  });
});
