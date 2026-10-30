import { ShieldCheck } from 'lucide-react';
import { ProgramGrid } from '@/components/program/program-grid';
import { SectionHead } from '@/components/ui/section-head';
import type { FeaturedProgramsProps } from './types';

export function FeaturedPrograms({ programs, wilayah, builtOn }: FeaturedProgramsProps) {
  return (
    <section className="program-section section">
      <div className="container">
        <SectionHead
          eyebrow="TEMUKAN PELUANG"
          title="Program yang mungkin kamu butuhkan."
          description="Setiap kesempatan punya jalan. Temukan yang sesuai untukmu."
          href="/kenali-hakmu"
          linkText="Lihat semua program"
        />
        <ProgramGrid programs={programs} wilayah={wilayah} builtOn={builtOn} />
        <div className="small-note">
          <ShieldCheck size={14} /> Setiap kartu menampilkan sumber dan tingkat verifikasinya.
          Periksa ketentuan di kanal resmi sebelum mengajukan.
        </div>
      </div>
    </section>
  );
}
