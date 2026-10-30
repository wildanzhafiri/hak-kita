import type { Metadata } from 'next';
import { TINGKAT_VERIFIKASI } from '@hakkita/schema';
import { VERIFIKASI_STYLE } from '@/components/program/constants';
import { PageShell } from '@/components/layout/page-shell';
import { DataNote } from '@/components/ui/data-note';
import { DataTable } from '@/components/ui/data-table';
import { loadPrograms, loadWilayahFile } from '@/server/data';
import { SOURCE_RULES, VERIFIKASI_MEANING } from './content';

const DESCRIPTION = 'Kenali asal informasi, cakupan, dan batasan data yang ditampilkan di HAKKITA.';

export const metadata: Metadata = { title: 'Sumber & batasan data', description: DESCRIPTION };

export default async function SumberDataPage() {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  const coveredWilayah = wilayahFile.wilayah.filter((w) => w.level !== 'kabkota');

  return (
    <PageShell
      breadcrumbs={[{ label: 'Sumber & batasan data' }]}
      eyebrow="SUMBER & BATASAN DATA"
      title="Transparansi dimulai dari sumbernya."
      description={DESCRIPTION}
    >
      <DataNote>
        HAKKITA tidak menjamin informasi selalu terbaru. Selalu periksa ketentuan melalui kanal
        resmi penyelenggara sebelum mengajukan.
      </DataNote>
      <div className="panel">
        <h2>Tingkat verifikasi</h2>
        <p>
          Setiap entri menampilkan seberapa jauh isinya sudah diperiksa. Yang belum diperiksa tetap
          ditampilkan, tetapi diberi label, bukan disembunyikan.
        </p>
        <DataTable
          columns={['Tingkat', 'Artinya', 'Jumlah entri']}
          rows={TINGKAT_VERIFIKASI.map((tingkat) => ({
            key: tingkat,
            cells: [
              VERIFIKASI_STYLE[tingkat].label,
              VERIFIKASI_MEANING[tingkat],
              programs.filter((p) => p.verifikasi === tingkat).length,
            ],
          }))}
        />
      </div>
      <div className="panel">
        <h2>Sumber yang kami pakai</h2>
        <DataTable
          columns={['Jenis sumber', 'Peran']}
          rows={SOURCE_RULES.map(({ type, role }) => ({ key: type, cells: [type, role] }))}
        />
        <p className="small-note">
          Data yang tidak bisa dibuktikan dengan sumber resmi tidak ditampilkan sebagai fakta.
        </p>
      </div>
      <div className="panel">
        <h2>Cakupan wilayah saat ini</h2>
        <p>
          Pengguna di sebuah wilayah melihat program nasional dan program yang berlaku di wilayah
          itu. Wilayah yang belum terkurasi hanya menampilkan program nasional.
        </p>
        <DataTable
          columns={['Wilayah', 'Tingkat', 'Program tingkat wilayah ini']}
          rows={coveredWilayah.map((w) => ({
            key: w.kode,
            cells: [
              w.nama,
              w.level === 'nasional' ? 'Nasional' : 'Provinsi',
              programs.filter((p) => p.cakupan.kode === w.kode).length,
            ],
          }))}
        />
        <p className="small-note">
          Daftar wilayah masih terus diperluas. Cakupan kabupaten dan kota menyusul.
        </p>
      </div>
    </PageShell>
  );
}
