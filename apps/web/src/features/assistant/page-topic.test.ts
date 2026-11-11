import { describe, expect, it } from 'vitest';
import { readPageTopic } from './page-topic';

describe('readPageTopic', () => {
  it('reads the program name from a detail page title', () => {
    expect(readPageTopic('/kenali-hakmu/kip-kuliah', 'KIP Kuliah · HAKKITA')).toBe('KIP Kuliah');
    expect(readPageTopic('/layanan/ktp-el/', 'KTP Elektronik · HAKKITA')).toBe('KTP Elektronik');
  });

  it('returns nothing on list and other pages', () => {
    expect(readPageTopic('/kenali-hakmu', 'Kenali Hakmu · HAKKITA')).toBeNull();
    expect(readPageTopic('/anggaran', 'Telusuri Anggaran · HAKKITA')).toBeNull();
    expect(readPageTopic('/kenali-hakmu/kip-kuliah', ' · HAKKITA')).toBeNull();
  });
});
