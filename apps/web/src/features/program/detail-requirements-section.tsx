import { DataNote } from '@/components/ui/data-note';
import { DetailNumberedList } from './detail-numbered-list';
import { DetailSection } from './detail-section';
import type { RequirementsSectionProps } from './types';

export function DetailRequirementsSection({ program }: RequirementsSectionProps) {
  return (
    <DetailSection id="persyaratan" title="Persyaratan dan dokumen">
      <p className="text-[13px] leading-6 text-[var(--muted)]">
        Periksa persyaratan terbaru melalui kanal resmi sebelum mengurus.
      </p>
      <h3 className="mb-3 mt-[22px] text-[17px] tracking-normal">Persyaratan</h3>
      <DetailNumberedList entries={program.syarat.map((syarat) => syarat.teks)} />
      {program.tipeGerbang === 'desil' && (
        <DataNote>
          Penerima program ini ditetapkan lewat data pemerintah (desil). HAKKITA tidak dapat
          memeriksa maupun menghitung desilmu. Periksa melalui kanal resmi.
        </DataNote>
      )}
      {program.dokumen.length > 0 && (
        <>
          <h3 className="mb-3 mt-[22px] text-[17px] tracking-normal">
            Dokumen yang perlu disiapkan
          </h3>
          <DetailNumberedList entries={program.dokumen} />
        </>
      )}
    </DetailSection>
  );
}
