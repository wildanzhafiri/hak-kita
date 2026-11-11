import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from './header';

let pathname = '/';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

afterEach(() => {
  pathname = '/';
});

describe('Header', () => {
  it('shows the outlined Rencanaku action as the current page', () => {
    pathname = '/rencanaku';
    render(<Header />);

    const planLink = screen.getByRole('link', { name: 'Rencanaku' });
    expect(planLink.getAttribute('href')).toBe('/rencanaku');
    expect(planLink.getAttribute('aria-current')).toBe('page');
  });

  it('shows the redesign navigation and marks the current page', () => {
    pathname = '/kenali-hakmu/kip-kuliah';
    render(<Header />);

    expect(screen.getByRole('link', { name: 'Kenali Hakmu' }).getAttribute('href')).toBe(
      '/kenali-hakmu',
    );
    expect(screen.getByRole('link', { name: 'Kenali Hakmu' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByRole('link', { name: 'Telusuri Anggaran' }).getAttribute('href')).toBe(
      '/anggaran',
    );
  });

  it('keeps the compact navigation hidden until the toggle is pressed', () => {
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Buka navigasi' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('navigation', { name: 'Menu navigasi' })).toBeNull();
  });

  it('opens the compact navigation dropdown with the menu and both actions', () => {
    pathname = '/anggaran';
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }));
    const menu = within(screen.getByRole('navigation', { name: 'Menu navigasi' }).parentElement!);

    expect(menu.getByRole('link', { name: 'Telusuri Anggaran' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(menu.getByRole('link', { name: 'Beranda' }).getAttribute('href')).toBe('/');
    expect(menu.getByRole('link', { name: 'Rencanaku' }).getAttribute('href')).toBe('/rencanaku');
    expect(menu.getByRole('link', { name: 'Masuk' }).getAttribute('href')).toBe(
      '/masuk?next=%2Fanggaran',
    );
  });

  it('closes the compact navigation with the toggle and with Escape', () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tutup navigasi' }));
    expect(screen.getByRole('button', { name: 'Buka navigasi' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.getByRole('button', { name: 'Buka navigasi' }).getAttribute('aria-expanded'),
    ).toBe('false');
  });
});
