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

  it('keeps the header but drops the footer on the profile pages', () => {
    for (const path of ['/profil', '/profil/edit', '/selamat-datang']) {
      pathname = path;
      const { unmount } = render(
        <SiteFrame header={<header>List publik</header>} footer={<footer>Footer publik</footer>}>
          <p>Halaman akun</p>
        </SiteFrame>,
      );

      expect(screen.getByText('List publik')).toBeTruthy();
      expect(screen.queryByText('Footer publik')).toBeNull();
      unmount();
    }
  });

  it('swaps the whole frame for a minimal header on the sign-in and sign-up pages', () => {
    for (const path of ['/masuk', '/daftar', '/lupa-kata-sandi']) {
      pathname = path;
      const { unmount } = render(
        <SiteFrame header={<header>List publik</header>} footer={<footer>Footer publik</footer>}>
          <p>Formulir akun</p>
        </SiteFrame>,
      );

      expect(screen.queryByText('List publik')).toBeNull();
      expect(screen.queryByText('Footer publik')).toBeNull();
      expect(screen.getByRole('link', { name: /Kembali ke beranda/ }).getAttribute('href')).toBe(
        '/',
      );
      expect(screen.getByRole('main').textContent).toContain('Formulir akun');
      unmount();
    }
  });

  it('uses the public navigation on Rencanaku pages', () => {
    pathname = '/rencanaku/tersimpan';
    render(
      <SiteFrame header={<header>List publik</header>} footer={<footer>Footer publik</footer>}>
        <p>Ruang rencana</p>
      </SiteFrame>,
    );

    expect(screen.getByText('List publik')).toBeTruthy();
    expect(screen.getByText('Footer publik')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('Ruang rencana');
    expect(screen.getByRole('link', { name: 'Lewati ke konten' }).getAttribute('href')).toBe(
      '#main',
    );
  });
});
