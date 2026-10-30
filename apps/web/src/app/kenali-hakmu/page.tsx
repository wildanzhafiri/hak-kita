import type { Metadata } from 'next';
import { isLayanan, todayWIB } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { ProgramList } from '@/features/program/program-list';
import { loadPrograms, loadWilayahFile } from '@/server/data';

const DESCRIPTION =
  'Jelajahi program bantuan dan dukungan publik berdasarkan kebutuhan, wilayah, serta persyaratannya.';

export const metadata: Metadata = { title: 'Kenali Hakmu', description: DESCRIPTION };

export default async function KenaliHakmuPage() {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  return (
    <PageShell
      breadcrumbs={[{ label: 'Kenali Hakmu' }]}
      eyebrow="KENALI HAKMU"
      title="Temukan program yang sesuai dengan kebutuhanmu."
      description={DESCRIPTION}
    >
      <ProgramList
        programs={programs.filter((p) => !isLayanan(p))}
        wilayah={wilayahFile.wilayah}
        builtOn={todayWIB()}
        placeholder="Cari program..."
      />
    </PageShell>
  );
}
