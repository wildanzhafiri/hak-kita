import 'server-only';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { loadApbdBudgetData, parseApbdBudgetSnapshot } from './budget';

const xml = `<Workbook><Worksheet><Table>
<Row><Cell><Data>Akun</Data></Cell><Cell><Data>Anggaran</Data></Cell><Cell><Data>Realisasi</Data></Cell><Cell><Data>Persentase</Data></Cell></Row>
<Row><Cell><Data>Pendapatan Daerah</Data></Cell><Cell><Data>1.19465753E+15</Data></Cell><Cell><Data>8.5870803E+14</Data></Cell><Cell><Data>71.88</Data></Cell></Row>
<Row><Cell><Data>PAD</Data></Cell><Cell><Data>4.3306345E+14</Data></Cell><Cell><Data>3.036432E+14</Data></Cell><Cell><Data>70.12</Data></Cell></Row>
<Row><Cell><Data>Belanja Daerah</Data></Cell><Cell><Data>1.27171367E+15</Data></Cell><Cell><Data>8.1159404E+14</Data></Cell><Cell><Data>63.82</Data></Cell></Row>
<Row><Cell><Data>Belanja Pegawai</Data></Cell><Cell><Data>5.0614932890752E+14</Data></Cell><Cell><Data>3.6136507877966E+14</Data></Cell><Cell><Data>71.40</Data></Cell></Row>
<Row><Cell><Data>Belanja Pegawai</Data></Cell><Cell><Data>5.0614932890752E+14</Data></Cell><Cell><Data>3.6136507877966E+14</Data></Cell><Cell><Data>71.40</Data></Cell></Row>
<Row><Cell><Data>Belanja Barang dan Jasa</Data></Cell><Cell><Data>3.8146600116032E+14</Data></Cell><Cell><Data>2.1549189374574E+14</Data></Cell><Cell><Data>56.49</Data></Cell></Row>
<Row><Cell><Data>Belanja Modal</Data></Cell><Cell><Data>1.5601268457505E+14</Data></Cell><Cell><Data>56302097308721</Data></Cell><Cell><Data>36.09</Data></Cell></Row>
<Row><Cell><Data>Belanja Lainnya</Data></Cell><Cell><Data>2.2304731656411E+14</Data></Cell><Cell><Data>1.2120474524476E+14</Data></Cell><Cell><Data>54.34</Data></Cell></Row>
<Row><Cell><Data>Pembiayaan Daerah</Data></Cell><Cell><Data>7.858829E+13</Data></Cell><Cell><Data>6.188653E+13</Data></Cell><Cell><Data>78.75</Data></Cell></Row>
</Table></Worksheet></Workbook>`;

const html =
  '<label id="keterangan">Keterangan: Data APBD Murni/Perubahan, realisasi APBD s.d November 2026, - data diterima SIKD per 10 November 2026</label>';

describe('parseApbdBudgetSnapshot', () => {
  it('parses the official period and four allocation and realization categories', () => {
    expect(parseApbdBudgetSnapshot(2026, xml, html)).toEqual({
      year: 2026,
      period: 'November 2026',
      periodNumber: 11,
      dataReceived: '10 November 2026',
      regionLabel: 'Nasional',
      sourceUrl: 'https://djpk.kemenkeu.go.id/portal/data/apbd',
      totalAllocation: 1271713.67,
      totalRealization: 811594.04,
      realizationPercent: 63.82,
      categories: [
        { label: 'Belanja Pegawai', allocation: 506149.32890752, realization: 361365.07877966 },
        {
          label: 'Belanja Barang dan Jasa',
          allocation: 381466.00116032,
          realization: 215491.89374574,
        },
        { label: 'Belanja Modal', allocation: 156012.68457505, realization: 56302.097308721 },
        { label: 'Belanja Lainnya', allocation: 223047.31656411, realization: 121204.74524476 },
      ],
      expenses: [
        {
          label: 'Belanja Daerah',
          allocation: 1271713.67,
          realization: 811594.04,
          realizationPercent: 63.82,
        },
        {
          label: 'Belanja Pegawai',
          allocation: 506149.32890752,
          realization: 361365.07877966,
          realizationPercent: 71.4,
        },
        {
          label: 'Belanja Barang dan Jasa',
          allocation: 381466.00116032,
          realization: 215491.89374574,
          realizationPercent: 56.49,
        },
        {
          label: 'Belanja Modal',
          allocation: 156012.68457505,
          realization: 56302.097308721,
          realizationPercent: 36.09,
        },
        {
          label: 'Belanja Lainnya',
          allocation: 223047.31656411,
          realization: 121204.74524476,
          realizationPercent: 54.34,
        },
      ],
      revenues: [
        {
          label: 'Pendapatan Daerah',
          allocation: 1194657.53,
          realization: 858708.03,
          realizationPercent: 71.88,
        },
        {
          label: 'PAD',
          allocation: 433063.45,
          realization: 303643.2,
          realizationPercent: 70.12,
        },
      ],
    });
  });

  it('throws when an official category is missing', () => {
    const missingCapitalSpending = xml.replace(
      /<Row><Cell><Data>Belanja Modal<\/Data>[\s\S]*?<\/Row>/,
      '',
    );

    expect(() => parseApbdBudgetSnapshot(2026, missingCapitalSpending, html)).toThrow(
      'Data APBD SIKD tidak memuat nilai yang valid untuk Belanja Modal.',
    );
  });

  it('throws when the official reporting period is missing', () => {
    expect(() => parseApbdBudgetSnapshot(2026, xml, '<html></html>')).toThrow(
      'Periode pelaporan APBD tidak ditemukan pada Portal Data SIKD.',
    );
  });

  it('uses SIKD reporting metadata to fetch current period APBD data', async () => {
    const metadataHtml = `${html}<select name="tahun"><option value="2026">2026</option></select><select name="provinsi"><option value="--">Semua Provinsi</option><option value="10">Provinsi Jawa Barat</option></select><select name="pemda"><option value="--">Semua pemda</option><option value="00">Provinsi Jawa Barat</option><option value="01">Kab. Bandung</option></select>`;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(metadataHtml))
      .mockResolvedValueOnce(new Response(xml));
    vi.stubGlobal('fetch', fetchMock);

    const { snapshot, filters } = await loadApbdBudgetData({ year: 2026 });
    const pageUrl = new URL(fetchMock.mock.calls[0]?.[0] as URL);
    const dataUrl = new URL(fetchMock.mock.calls[1]?.[0] as URL);

    expect(snapshot.period).toBe('November 2026');
    expect(pageUrl.searchParams.has('periode')).toBe(false);
    expect(dataUrl.searchParams.get('periode')).toBe('11');
    expect(filters.provinces).toContainEqual({ value: '--', label: 'Nasional' });
    expect(filters.regions).toHaveLength(0);

    vi.unstubAllGlobals();
  });
});
