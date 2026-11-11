import { describe, expect, it } from 'vitest';
import { isCurrentPath } from './navigation';

describe('isCurrentPath', () => {
  it('matches the home page only exactly', () => {
    expect(isCurrentPath('/', '/')).toBe(true);
    expect(isCurrentPath('/anggaran', '/')).toBe(false);
  });

  it('matches a section and its subpages but not look-alike paths', () => {
    expect(isCurrentPath('/kenali-hakmu', '/kenali-hakmu')).toBe(true);
    expect(isCurrentPath('/kenali-hakmu/kip-kuliah', '/kenali-hakmu')).toBe(true);
    expect(isCurrentPath('/kenali-hakmu-baru', '/kenali-hakmu')).toBe(false);
  });
});
