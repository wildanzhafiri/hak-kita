import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RencanaGuestGate } from './rencana-guest-gate';

describe('RencanaGuestGate', () => {
  it('asks a guest to sign in and shows nothing of the plan', () => {
    render(<RencanaGuestGate />);

    expect(screen.getByRole('heading', { level: 1, name: 'Rencanaku' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Masuk untuk melihat Rencanaku' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /Masuk \/ Daftar/ }).getAttribute('href')).toBe(
      '/masuk?next=%2Frencanaku',
    );
    expect(screen.getByRole('link', { name: 'Jelajahi program' }).getAttribute('href')).toBe(
      '/kenali-hakmu',
    );
  });
});
