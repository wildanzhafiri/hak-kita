import type { Metadata } from 'next';
import { isLayanan, todayWIB } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { ProgramList } from '@/features/program/program-list';
import { loadPrograms, loadWilayahFile } from '@/server/data';

const DESCRIPTION = 'Temukan persyaratan dan langkah pengurusan layanan yang kamu butuhkan.';

export const metadata: Metadata = { title: 'Urus Kebutuhanmu', description: DESCRIPTION };

export default async function UrusKebutuhanmuPage() {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  return (
    <PageShell
      breadcrumbs={[{ label: 'Urus Kebutuhanmu' }]}
      eyebrow="URUS KEBUTUHANMU"
      title="Urus layanan publik tanpa bingung mulai dari mana."
      description={DESCRIPTION}
    >
      <ProgramList
        programs={programs.filter(isLayanan)}
        wilayah={wilayahFile.wilayah}
        builtOn={todayWIB()}
        placeholder="Cari layanan..."
      />
    </PageShell>
  );
}
