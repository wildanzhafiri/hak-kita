import { DataNote } from '@/components/ui/data-note';
import type { RequirementsTabProps } from './types';

export function DetailRequirementsTab({ program }: RequirementsTabProps) {
  return (
    <>
      <h2>Siapkan persyaratanmu.</h2>
      <p>
        Syarat di bawah ini bersumber dari penyelenggara dan bisa berubah. Pastikan lagi melalui
        kanal resmi.
      </p>
      <ul className="prose-list">
        {program.syarat.map((syarat) => (
          <li key={syarat.teks}>{syarat.teks}</li>
        ))}
      </ul>
      {program.tipeGerbang === 'desil' && (
        <DataNote>
          Kelayakan program ini ditetapkan lewat data pemerintah (desil). HAKKITA tidak dapat
          memeriksa maupun menghitung desilmu. Cek melalui kanal resmi.
        </DataNote>
      )}
      {program.dokumen.length > 0 && (
        <>
          <h3>Dokumen yang perlu disiapkan</h3>
          <ul className="prose-list">
            {program.dokumen.map((dokumen) => (
              <li key={dokumen}>{dokumen}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
