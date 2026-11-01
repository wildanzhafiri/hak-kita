import 'server-only';
import type { ApbdBudgetCategory, ApbdBudgetSnapshot } from './types';

const SIKD_PAGE_URL = 'https://djpk.kemenkeu.go.id/portal/data/apbd';
const SIKD_DATA_URL = 'https://djpk.kemenkeu.go.id/portal/csv_apbd';
const RUPIAH_PER_BILLION = 1_000_000_000;
const CATEGORY_LABELS = [
  'Belanja Pegawai',
  'Belanja Barang dan Jasa',
  'Belanja Modal',
  'Belanja Lainnya',
] as const;

function readXmlCells(row: string): string[] {
  return [...row.matchAll(/<Data[^>]*>([\s\S]*?)<\/Data>/g)].map((match) =>
    (match[1] ?? '').trim(),
  );
}

function parseCategoryRows(xml: string): ApbdBudgetCategory[] {
  const rows = [...xml.matchAll(/<Row>([\s\S]*?)<\/Row>/g)].map((match) =>
    readXmlCells(match[1] ?? ''),
  );

  return CATEGORY_LABELS.map((label) => {
    const row = rows.find((cells) => cells[0]?.trim() === label);
    const allocation = Number(row?.[1]);
    const realization = Number(row?.[2]);

    if (!Number.isFinite(allocation) || !Number.isFinite(realization)) {
      throw new Error(`Data APBD SIKD tidak memuat nilai yang valid untuk ${label}.`);
    }

    return {
      label,
      allocation: allocation / RUPIAH_PER_BILLION,
      realization: realization / RUPIAH_PER_BILLION,
    };
  });
}

function parseReportingNote(html: string): { period: string; dataReceived: string } {
  const note = html.match(/<label id="keterangan"[^>]*>([\s\S]*?)<\/label>/i)?.[1];
  const plainText = note
    ?.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const reporting = plainText?.match(
    /realisasi APBD\s*s\.d\s*(.+?)\s*-\s*data diterima SIKD per\s*(.+)$/i,
  );

  if (!reporting?.[1] || !reporting[2]) {
    throw new Error('Periode pelaporan APBD tidak ditemukan pada Portal Data SIKD.');
  }

  return { period: reporting[1].trim(), dataReceived: reporting[2].trim() };
}

export function parseApbdBudgetSnapshot(
  year: number,
  xml: string,
  html: string,
): ApbdBudgetSnapshot {
  return {
    year,
    ...parseReportingNote(html),
    categories: parseCategoryRows(xml),
  };
}

export async function loadApbdBudgetSnapshot(year: number): Promise<ApbdBudgetSnapshot> {
  const pageUrl = new URL(SIKD_PAGE_URL);
  pageUrl.search = new URLSearchParams({
    pemda: '--',
    periode: '12',
    provinsi: '--',
    tahun: `${year}`,
  }).toString();

  const dataUrl = new URL(SIKD_DATA_URL);
  dataUrl.search = new URLSearchParams({
    type: 'apbd',
    periode: '12',
    tahun: `${year}`,
    provinsi: '--',
    pemda: '--',
  }).toString();

  const [pageResponse, dataResponse] = await Promise.all([
    fetch(pageUrl, { next: { revalidate: 3600 } }),
    fetch(dataUrl, { next: { revalidate: 3600 } }),
  ]);

  if (!pageResponse.ok || !dataResponse.ok) {
    throw new Error('Portal Data SIKD tidak dapat dimuat saat ini.');
  }

  const [html, xml] = await Promise.all([pageResponse.text(), dataResponse.text()]);

  return parseApbdBudgetSnapshot(year, xml, html);
}
