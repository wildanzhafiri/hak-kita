import 'server-only';
import { parse } from 'parse5';
import type {
  ApbdBudgetCategory,
  ApbdBudgetFilters,
  ApbdBudgetLine,
  ApbdBudgetSnapshot,
  BudgetOption,
} from './types';

const SIKD_PAGE_URL = 'https://djpk.kemenkeu.go.id/portal/data/apbd';
const SIKD_DATA_URL = 'https://djpk.kemenkeu.go.id/portal/csv_apbd';
const RUPIAH_PER_BILLION = 1_000_000_000;
const CATEGORY_LABELS = [
  'Belanja Pegawai',
  'Belanja Barang dan Jasa',
  'Belanja Modal',
  'Belanja Lainnya',
] as const;
const MONTH_NUMBERS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};
const MONTH_NAMES = Object.keys(MONTH_NUMBERS);

interface HtmlNode {
  tagName?: string;
  attrs?: Array<{ name: string; value: string }>;
  childNodes?: HtmlNode[];
  value?: string;
}

interface ReportingNote {
  period: string;
  periodNumber: number;
  dataReceived: string;
}

interface ApbdBudgetQuery {
  year: number;
  period?: number;
  province?: string;
  region?: string;
}

interface ApbdBudgetData {
  filters: ApbdBudgetFilters;
  snapshot: ApbdBudgetSnapshot;
}

function readXmlCells(row: string): string[] {
  return [...row.matchAll(/<Data[^>]*>([\s\S]*?)<\/Data>/g)].map((match) =>
    (match[1] ?? '').trim(),
  );
}

function parseXmlLines(xml: string): ApbdBudgetLine[] {
  return [...xml.matchAll(/<Row>([\s\S]*?)<\/Row>/g)]
    .map((match) => readXmlCells(match[1] ?? ''))
    .filter((cells) => cells.length >= 4 && cells[0] !== 'Akun')
    .map((cells) => {
      const allocation = Number(cells[1]);
      const realization = Number(cells[2]);
      const realizationPercent = Number(cells[3]);

      if (
        !cells[0] ||
        !Number.isFinite(allocation) ||
        !Number.isFinite(realization) ||
        !Number.isFinite(realizationPercent)
      ) {
        return null;
      }

      return {
        label: cells[0].trim(),
        allocation: allocation / RUPIAH_PER_BILLION,
        realization: realization / RUPIAH_PER_BILLION,
        realizationPercent,
      };
    })
    .filter((line): line is ApbdBudgetLine => line !== null);
}

function parseCategoryRows(lines: readonly ApbdBudgetLine[]): ApbdBudgetCategory[] {
  return CATEGORY_LABELS.map((label) => {
    const line = lines.find((item) => item.label === label);

    if (!line) {
      throw new Error(`Data APBD SIKD tidak memuat nilai yang valid untuk ${label}.`);
    }

    return {
      label,
      allocation: line.allocation,
      realization: line.realization,
    };
  });
}

function readText(node: HtmlNode): string {
  return (node.value ?? '') + (node.childNodes ?? []).map(readText).join('');
}

function findNode(
  node: HtmlNode,
  predicate: (candidate: HtmlNode) => boolean,
): HtmlNode | undefined {
  if (predicate(node)) return node;

  for (const child of node.childNodes ?? []) {
    const result = findNode(child, predicate);
    if (result) return result;
  }

  return undefined;
}

function findNodes(node: HtmlNode, predicate: (candidate: HtmlNode) => boolean): HtmlNode[] {
  const matches = predicate(node) ? [node] : [];

  for (const child of node.childNodes ?? []) {
    matches.push(...findNodes(child, predicate));
  }

  return matches;
}

function attribute(node: HtmlNode, name: string): string | undefined {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function parseSelectOptions(html: string, name: string): BudgetOption[] {
  const root = parse(html) as unknown as HtmlNode;
  const select = findNode(
    root,
    (node) => node.tagName === 'select' && attribute(node, 'name') === name,
  );

  if (!select) return [];

  return findNodes(select, (node) => node.tagName === 'option')
    .map((option) => ({
      value: attribute(option, 'value') ?? '',
      label: readText(option).replace(/\s+/g, ' ').trim(),
    }))
    .filter((option) => option.value && option.label);
}

function parseReportingNote(html: string): ReportingNote {
  const root = parse(html) as unknown as HtmlNode;
  const note = findNode(
    root,
    (node) => node.tagName === 'label' && attribute(node, 'id') === 'keterangan',
  );
  const plainText = note ? readText(note).replace(/\s+/g, ' ').trim() : '';
  const reporting = plainText.match(
    /realisasi APBD\s*s\.d\s*(.+?)\s*-\s*data diterima SIKD per\s*(.+)$/i,
  );

  if (!reporting?.[1] || !reporting[2]) {
    throw new Error('Periode pelaporan APBD tidak ditemukan pada Portal Data SIKD.');
  }

  const period = reporting[1].trim().replace(/[,.\s]+$/, '');
  const monthName = period.split(/\s+/)[0]?.toLocaleLowerCase('id-ID');
  const periodNumber = monthName ? MONTH_NUMBERS[monthName] : undefined;

  if (!periodNumber) {
    throw new Error('Bulan pelaporan APBD tidak dikenali dari Portal Data SIKD.');
  }

  return { period, periodNumber, dataReceived: reporting[2].trim() };
}

function createPageUrl(query: ApbdBudgetQuery, includePeriod: boolean): URL {
  const pageUrl = new URL(SIKD_PAGE_URL);
  const params = new URLSearchParams({
    pemda: query.region ?? '--',
    provinsi: query.province ?? '--',
    tahun: `${query.year}`,
  });

  if (includePeriod && query.period) params.set('periode', `${query.period}`);
  pageUrl.search = params.toString();
  return pageUrl;
}

function createDataUrl(query: ApbdBudgetQuery): URL {
  const dataUrl = new URL(SIKD_DATA_URL);
  dataUrl.search = new URLSearchParams({
    type: 'apbd',
    periode: `${query.period}`,
    tahun: `${query.year}`,
    provinsi: query.province ?? '--',
    pemda: query.region ?? '--',
  }).toString();
  return dataUrl;
}

function getPeriodOptions(maxPeriod: number): BudgetOption[] {
  return MONTH_NAMES.slice(0, maxPeriod).map((month, index) => ({
    value: `${index + 1}`,
    label: month[0]?.toLocaleUpperCase('id-ID') + month.slice(1),
  }));
}

function getYearOptions(currentYear: number): BudgetOption[] {
  return [currentYear, currentYear - 1].map((year) => ({
    value: `${year}`,
    label: `${year}`,
  }));
}

function createFilters(
  html: string,
  year: number,
  periodNumber: number,
  province: string,
): ApbdBudgetFilters {
  const currentYear = new Date().getFullYear();
  const maxPeriod = year >= currentYear ? periodNumber : 12;
  const provinces = parseSelectOptions(html, 'provinsi').map((option) =>
    option.value === '--' ? { ...option, label: 'Nasional' } : option,
  );
  const regions = province === '--' ? [] : parseSelectOptions(html, 'pemda');

  return {
    years: getYearOptions(currentYear),
    periods: getPeriodOptions(maxPeriod),
    provinces,
    regions: regions.map((option) =>
      option.value === '--'
        ? { ...option, label: 'Gabungan kabupaten dan kota' }
        : option.value === '00'
          ? { ...option, label: 'Pemerintah provinsi' }
          : option,
    ),
    maxPeriod,
  };
}

function findLine(lines: readonly ApbdBudgetLine[], label: string): ApbdBudgetLine {
  const line = lines.find((item) => item.label === label);

  if (!line) {
    throw new Error(`Data APBD SIKD tidak memuat nilai yang valid untuk ${label}.`);
  }

  return line;
}

function uniqueLines(lines: readonly ApbdBudgetLine[]): ApbdBudgetLine[] {
  return [...new Map(lines.map((line) => [line.label, line])).values()];
}

function getLinesBetween(
  lines: readonly ApbdBudgetLine[],
  startLabel: string,
  endLabel: string,
): ApbdBudgetLine[] {
  const start = lines.findIndex((line) => line.label === startLabel);
  const end = lines.findIndex((line) => line.label === endLabel);

  if (start < 0 || end <= start) return [];

  return uniqueLines(lines.slice(start, end));
}

function getRegionLabel(
  html: string,
  province: string,
  region: string,
  provinces: readonly BudgetOption[],
  regions: readonly BudgetOption[],
): string {
  if (province === '--') return 'Nasional';
  const root = parse(html) as unknown as HtmlNode;
  const headings = findNodes(root, (node) => /^h[1-6]$/.test(node.tagName ?? ''));
  const sourceHeading = headings.map((node) => readText(node).replace(/\s+/g, ' ').trim()).at(-1);

  if (region === '--') {
    return (
      sourceHeading ||
      `Gabungan pemda ${provinces.find((item) => item.value === province)?.label ?? ''}`
    );
  }
  if (region === '00') {
    return `Pemerintah ${provinces.find((item) => item.value === province)?.label ?? 'provinsi'}`;
  }

  return (
    sourceHeading || regions.find((item) => item.value === region)?.label || 'Wilayah terpilih'
  );
}

export async function loadApbdBudgetData({
  year,
  period,
  province = '--',
  region = '--',
}: ApbdBudgetQuery): Promise<ApbdBudgetData> {
  const currentYear = new Date().getFullYear();
  const selectedYear = Math.min(Math.max(year, currentYear - 1), currentYear);
  const metadataUrl = createPageUrl({ year: selectedYear, province, region: '--' }, false);
  const metadataResponse = await fetch(metadataUrl, { next: { revalidate: 3600 } });

  if (!metadataResponse.ok) throw new Error('Portal Data SIKD tidak dapat dimuat saat ini.');

  const metadataHtml = await metadataResponse.text();
  const latestReport = parseReportingNote(metadataHtml);
  const filters = createFilters(metadataHtml, selectedYear, latestReport.periodNumber, province);
  const selectedPeriod = Math.min(
    Math.max(period ?? (selectedYear < currentYear ? 12 : latestReport.periodNumber), 1),
    filters.maxPeriod,
  );
  const query = { year: selectedYear, period: selectedPeriod, province, region };
  const selectedPageUrl = createPageUrl(query, true);
  const selectedPageResponse =
    selectedPeriod === latestReport.periodNumber && region === '--'
      ? null
      : await fetch(selectedPageUrl, { next: { revalidate: 3600 } });

  if (selectedPageResponse && !selectedPageResponse.ok) {
    throw new Error('Rincian anggaran wilayah tidak dapat dimuat saat ini.');
  }

  const selectedHtml = selectedPageResponse ? await selectedPageResponse.text() : metadataHtml;
  const report = parseReportingNote(selectedHtml);
  const [dataResponse] = await Promise.all([
    fetch(createDataUrl(query), { next: { revalidate: 3600 } }),
  ]);

  if (!dataResponse.ok) throw new Error('Data APBD SIKD tidak dapat dimuat saat ini.');

  const xml = await dataResponse.text();
  const lines = parseXmlLines(xml);
  const totalExpense = findLine(lines, 'Belanja Daerah');
  const regionLabel = getRegionLabel(
    selectedHtml,
    province,
    region,
    filters.provinces,
    filters.regions,
  );

  return {
    filters,
    snapshot: {
      year: selectedYear,
      period: report.period,
      periodNumber: report.periodNumber,
      dataReceived: report.dataReceived,
      regionLabel,
      sourceUrl: selectedPageUrl.toString(),
      totalAllocation: totalExpense.allocation,
      totalRealization: totalExpense.realization,
      realizationPercent: totalExpense.realizationPercent,
      categories: parseCategoryRows(lines),
      expenses: getLinesBetween(lines, 'Belanja Daerah', 'Pembiayaan Daerah'),
      revenues: getLinesBetween(lines, 'Pendapatan Daerah', 'Belanja Daerah'),
    },
  };
}

export async function loadApbdBudgetSnapshot(year: number): Promise<ApbdBudgetSnapshot> {
  const { snapshot } = await loadApbdBudgetData({ year });
  return snapshot;
}

export function parseApbdBudgetSnapshot(
  year: number,
  xml: string,
  html: string,
): ApbdBudgetSnapshot {
  const report = parseReportingNote(html);
  const lines = parseXmlLines(xml);
  const totalExpense = findLine(lines, 'Belanja Daerah');

  return {
    year,
    period: report.period,
    periodNumber: report.periodNumber,
    dataReceived: report.dataReceived,
    regionLabel: 'Nasional',
    sourceUrl: SIKD_PAGE_URL,
    totalAllocation: totalExpense.allocation,
    totalRealization: totalExpense.realization,
    realizationPercent: totalExpense.realizationPercent,
    categories: parseCategoryRows(lines),
    expenses: getLinesBetween(lines, 'Belanja Daerah', 'Pembiayaan Daerah'),
    revenues: getLinesBetween(lines, 'Pendapatan Daerah', 'Belanja Daerah'),
  };
}
