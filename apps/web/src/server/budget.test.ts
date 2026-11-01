import 'server-only';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { parseApbdBudgetSnapshot } from './budget';

const xml = `<Workbook><Worksheet><Table>
<Row><Cell><Data>Belanja Pegawai</Data></Cell><Cell><Data>5.0614932890752E+14</Data></Cell><Cell><Data>3.6136507877966E+14</Data></Cell></Row>
<Row><Cell><Data>Belanja Pegawai</Data></Cell><Cell><Data>5.0614932890752E+14</Data></Cell><Cell><Data>3.6136507877966E+14</Data></Cell></Row>
<Row><Cell><Data>Belanja Barang dan Jasa</Data></Cell><Cell><Data>3.8146600116032E+14</Data></Cell><Cell><Data>2.1549189374574E+14</Data></Cell></Row>
<Row><Cell><Data>Belanja Modal</Data></Cell><Cell><Data>1.5601268457505E+14</Data></Cell><Cell><Data>56302097308721</Data></Cell></Row>
<Row><Cell><Data>Belanja Lainnya</Data></Cell><Cell><Data>2.2304731656411E+14</Data></Cell><Cell><Data>1.2120474524476E+14</Data></Cell></Row>
</Table></Worksheet></Workbook>`;

const html =
  '<label id="keterangan">Keterangan: Data APBD Murni/Perubahan, realisasi APBD s.d Desember 2026 - data diterima SIKD per 31 Oktober 2026</label>';

describe('parseApbdBudgetSnapshot', () => {
  it('parses the official period and four allocation and realization categories', () => {
    expect(parseApbdBudgetSnapshot(2026, xml, html)).toEqual({
      year: 2026,
      period: 'Desember 2026',
      dataReceived: '31 Oktober 2026',
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
});
