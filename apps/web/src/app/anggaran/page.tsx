import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { loadApbdBudgetData } from '@/server/budget';
import { ANGGARAN_CONTENT } from './content';
import { ApbdBudgetOverview } from './budget-apbd-overview';
import { BudgetApbnFilters } from './budget-apbn-filters';
import { BudgetFilters } from './budget-filters';
import { BudgetOverview } from './budget-overview';
import { BudgetTabs } from './budget-tabs';

export const metadata: Metadata = {
  title: 'Telusuri Anggaran',
  description: ANGGARAN_CONTENT.description,
};

export const revalidate = 3600;

interface AnggaranPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AnggaranPage({ searchParams }: AnggaranPageProps) {
  const query = await searchParams;
  const selectedScope = getQueryValue(query.scope) === 'apbd' ? 'apbd' : 'apbn';
  const currentYear = new Date().getFullYear();
  const selectedApbnYear = getQueryValue(query.year) === '2025' ? 2025 : 2026;
  const selectedProvince = getQueryValue(query.province) || '--';
  const selectedRegion = getQueryValue(query.region) || '--';
  let apbdData: Awaited<ReturnType<typeof loadApbdBudgetData>> | null = null;

  if (selectedScope === 'apbd') {
    const requestedYear = Number(getQueryValue(query.year)) || currentYear;

    try {
      apbdData = await loadApbdBudgetData({
        year: requestedYear,
        province: selectedProvince,
        region: selectedRegion || '--',
      });
    } catch {
      apbdData = null;
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto w-[calc(100%-40px)] max-w-[1328px] pb-16 md:w-[calc(100%-64px)]">
        <Breadcrumbs
          label="Jejak navigasi"
          items={[{ label: 'Beranda', href: '/' }, ...ANGGARAN_CONTENT.breadcrumbs]}
        />
        <header className="pb-6 pt-14 max-[640px]:pt-9">
          <h1 className="text-[clamp(27px,3vw,32px)] font-bold leading-[1.25] tracking-[-.025em] text-[#253044]">
            {ANGGARAN_CONTENT.title}
          </h1>
          <p className="mt-4 max-w-[80ch] text-[15px] leading-[1.65] text-[#617087] max-[640px]:text-sm">
            {ANGGARAN_CONTENT.description}
          </p>
        </header>
        <BudgetTabs scope={selectedScope} />
        {selectedScope === 'apbn' ? (
          <>
            <BudgetApbnFilters year={selectedApbnYear} />
            {selectedApbnYear === 2026 ? (
              <BudgetOverview />
            ) : (
              <section className="rounded-xl border border-[#dce8f5] bg-[#f5f8fc] px-6 py-8 text-center">
                <h2 className="text-lg font-semibold text-[#253044]">
                  Data anggaran belum tersedia
                </h2>
                <p className="mx-auto mt-2 max-w-[60ch] text-sm leading-relaxed text-[#617087]">
                  Rincian APBN 2025 belum tersedia di HAKKITA untuk ditampilkan di sini. Pilih tahun
                  2026 untuk melihat data yang sudah diperiksa.
                </p>
              </section>
            )}
          </>
        ) : apbdData ? (
          <>
            <BudgetFilters
              filters={apbdData.filters}
              selectedYear={apbdData.snapshot.year}
              selectedProvince={selectedProvince}
              selectedRegion={selectedRegion}
            />
            {selectedProvince === '--' || selectedRegion ? (
              <ApbdBudgetOverview snapshot={apbdData.snapshot} />
            ) : (
              <section className="rounded-xl border border-[#dce8f5] bg-[#f5f8fc] px-6 py-8 text-center">
                <h2 className="text-lg font-semibold text-[#253044]">
                  Pilih wilayah untuk melihat APBD
                </h2>
                <p className="mx-auto mt-2 max-w-[60ch] text-sm leading-relaxed text-[#617087]">
                  Pilih provinsi, lalu wilayah yang ingin kamu telusuri.
                </p>
              </section>
            )}
          </>
        ) : (
          <section className="rounded-xl border border-[#dce8f5] bg-[#f5f8fc] px-6 py-8 text-center">
            <h2 className="text-lg font-semibold text-[#253044]">Data APBD belum dapat dimuat</h2>
            <p className="mx-auto mt-2 max-w-[60ch] text-sm leading-relaxed text-[#617087]">
              Portal Data SIKD tidak merespons atau belum menyediakan rincian untuk pilihan ini.
              Coba kembali sebentar lagi atau buka sumber resminya.
            </p>
            <a
              className="mt-4 inline-flex min-h-10 items-center font-semibold text-[#196dcc] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc]"
              href={ANGGARAN_CONTENT.apbdSourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Buka Portal Data SIKD
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
