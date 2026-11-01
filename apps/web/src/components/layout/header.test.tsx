import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from './header';

let pathname = '/';

vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

afterEach(() => {
  pathname = '/';
});

describe('Header', () => {
  it('shows the redesign navigation and marks the current page', () => {
    pathname = '/program/kip-kuliah';
    render(<Header />);

    expect(screen.getByRole('link', { name: 'Kenali Hakmu' }).getAttribute('href')).toBe(
      '/program',
    );
    expect(screen.getByRole('link', { name: 'Kenali Hakmu' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(screen.getByRole('link', { name: 'Telusuri Anggaran' }).getAttribute('href')).toBe(
      '/anggaran',
    );
  });

  it('opens the compact navigation and returns focus after Escape', () => {
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Buka navigasi' }));
    expect(
      screen.getByRole('button', { name: 'Tutup navigasi' }).getAttribute('aria-expanded'),
    ).toBe('true');

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Escape' });
    const menuButton = screen.getByRole('button', { name: 'Buka navigasi' });
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menuButton);
  });
});
