import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VerifikasiBadge } from './verifikasi-badge';

describe('VerifikasiBadge', () => {
  it.each([
    ['lengkap', 'Terverifikasi lengkap'],
    ['dasar', 'Terverifikasi dasar'],
    ['belum', 'Belum diverifikasi'],
  ] as const)('shows the label for level %s', (tingkat, label) => {
    render(<VerifikasiBadge tingkat={tingkat} />);
    const badge = screen.getByText(label);
    expect(badge.className).toContain(tingkat);
  });
});
