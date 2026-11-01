import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SiteFrame } from './site-frame';

let pathname = '/';

vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

afterEach(() => {
  pathname = '/';
});

describe('SiteFrame', () => {
  it('shows the public navigation on public pages', () => {
    render(
      <SiteFrame header={<header>List publik</header>} footer={<footer>Footer publik</footer>}>
        <p>Halaman publik</p>
      </SiteFrame>,
    );

    expect(screen.getByText('List publik')).toBeTruthy();
    expect(screen.getByText('Footer publik')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('Halaman publik');
  });

  it('lets Rencanaku pages use their own navigation', () => {
    pathname = '/rencanaku/berkas';
    render(
      <SiteFrame header={<header>List publik</header>} footer={<footer>Footer publik</footer>}>
        <p>Ruang rencana</p>
      </SiteFrame>,
    );

    expect(screen.queryByText('List publik')).toBeNull();
    expect(screen.queryByText('Footer publik')).toBeNull();
    expect(screen.getByRole('main').textContent).toContain('Ruang rencana');
    expect(screen.getByRole('link', { name: 'Lewati ke konten' }).getAttribute('href')).toBe(
      '#main',
    );
  });
});
