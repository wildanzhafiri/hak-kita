import { describe, expect, it } from 'vitest';
import { programCategoryHref, searchHref } from './routes';

describe('catalog routes', () => {
  it('opens the selected program category in Kenali Hakmu', () => {
    expect(programCategoryHref('Pekerjaan & Pelatihan')).toBe(
      '/kenali-hakmu?kategori=Pekerjaan+%26+Pelatihan',
    );
  });

  it('searches programs and public services together', () => {
    expect(searchHref('Bantuan pendidikan')).toBe('/pencarian?q=Bantuan+pendidikan');
  });
});
