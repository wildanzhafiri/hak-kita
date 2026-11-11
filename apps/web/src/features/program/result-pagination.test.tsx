import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResultPagination } from './result-pagination';

describe('ResultPagination', () => {
  it('keeps every page visible for short result lists', () => {
    render(
      <ResultPagination ariaLabel="Halaman hasil" page={1} pageCount={4} onPageChange={vi.fn()} />,
    );

    for (const page of [1, 2, 3, 4]) {
      expect(screen.getByRole('button', { name: `Halaman ${page}` })).not.toBeNull();
    }
    expect(screen.queryByText('…')).toBeNull();
  });

  it('keeps one button per page and compacts neighboring pages on narrow screens', () => {
    const onPageChange = vi.fn();
    const { container, rerender } = render(
      <ResultPagination
        ariaLabel="Halaman hasil"
        page={4}
        pageCount={9}
        onPageChange={onPageChange}
      />,
    );
    const pagination = screen.getByRole('navigation', { name: 'Halaman hasil' });

    for (const page of [1, 3, 4, 5, 9]) {
      expect(screen.getByRole('button', { name: `Halaman ${page}` })).not.toBeNull();
    }
    expect(screen.getAllByRole('button', { name: 'Halaman 4' })).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Halaman 3' }).className).not.toContain(
      'max-[640px]:!hidden',
    );
    expect(screen.getByRole('button', { name: 'Halaman 5' }).className).not.toContain(
      'max-[640px]:!hidden',
    );
    expect(pagination.querySelectorAll('[data-pagination-ellipsis]')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'Halaman berikutnya' }));
    expect(onPageChange).toHaveBeenCalledWith(5);

    rerender(
      <ResultPagination
        ariaLabel="Halaman hasil"
        page={9}
        pageCount={9}
        onPageChange={onPageChange}
      />,
    );

    expect(container.querySelectorAll('[data-pagination-ellipsis]')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Halaman 9' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Halaman 8' }).className).not.toContain(
      'max-[640px]:!hidden',
    );
  });
});
