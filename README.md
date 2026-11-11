# HAKKITA

Platform yang memandu warga mengurus program dan layanan pemerintah langkah demi langkah. Informasi program dilengkapi rujukan dan keterangan verifikasi, dan kelak situs ini akan memetakan di langkah mana prosesnya paling sering tersendat.

## Tech stack

| Lapisan   | Pilihan                                                            |
| --------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript (strict)           |
| UI        | HeroUI v3, Tailwind CSS 4, lucide-react                            |
| Data      | Supabase dengan fallback YAML/JSON, divalidasi dengan zod          |
| Logika    | Paket `domain` (TypeScript murni) diuji dengan Vitest              |
| Tes UI    | Vitest, jsdom, Testing Library                                     |
| Monorepo  | pnpm workspaces                                                    |
| Kualitas  | ESLint, Prettier, GitHub Actions (validasi data, lint, tes, build) |

## Cara menjalankan

Prasyarat: **Node.js 22.12 atau lebih baru** dan **pnpm 11** (`corepack enable` lalu pnpm mengikuti versi di `package.json`, atau `npm i -g pnpm`).

```bash
git clone <url-repositori-ini>
cd hakkita
pnpm install
```

Untuk menjalankan aplikasi lokal, salin template env ke folder aplikasi lalu isi nilai yang dibutuhkan:

```powershell
Copy-Item .env.example apps/web/.env.local
pnpm dev
```

Buka http://localhost:3000. Tanpa env, halaman publik tetap memakai data YAML/JSON lokal. Login, sinkronisasi akun, asisten AI, dan email memerlukan layanan serta env masing-masing. Jangan commit file `.env.local`.

### Environment variables

`.env.example` di root repo adalah daftar lengkap nama variabel. Isi hanya nilai untuk layanan yang ingin kamu jalankan.

| Variabel                               | Dipakai untuk                                                             | Jenis       |
| -------------------------------------- | ------------------------------------------------------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Alamat proyek Supabase                                                    | Publik      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Koneksi browser ke Supabase                                               | Publik      |
| `SUPABASE_SERVICE_ROLE_KEY`            | Akses server untuk data dan proses akun                                   | Rahasia     |
| `DEMO_OFFLINE`                         | Isi `true` untuk memaksa fallback YAML/JSON                               | Opsional    |
| `AI_API_KEY`                           | Kunci API AI                                                              | Rahasia     |
| `AI_GATEWAY_BASE_URL`                  | URL endpoint AI                                                           | Konfigurasi |
| `AI_GATEWAY_MODEL`                     | ID model AI                                                               | Konfigurasi |
| `AI_GATEWAY_FALLBACK_MODEL`            | Daftar model cadangan, dipisahkan koma dan dicoba sesuai urutan           | Opsional    |
| `RADAR_AI_MODEL`                       | Model untuk menyiapkan draf Radar; bila kosong memakai `AI_GATEWAY_MODEL` | Opsional    |
| `TAVILY_API_KEY`                       | Pencarian halaman resmi untuk menemukan kandidat program baru             | Rahasia     |
| `TOOL_APPROVAL_SECRET`                 | Menandatangani persetujuan tindakan asisten                               | Rahasia     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | Widget Turnstile di browser                                               | Publik      |
| `TURNSTILE_SECRET_KEY`                 | Verifikasi Turnstile di server                                            | Rahasia     |
| `RESEND_API_KEY`                       | Mengirim pemberitahuan email                                              | Rahasia     |
| `EMAIL_FROM`                           | Alamat pengirim yang diverifikasi di Resend                               | Konfigurasi |
| `HAKKITA_SITE_URL`                     | URL utama situs untuk tautan email                                        | Konfigurasi |
| `CRON_SECRET`                          | Melindungi endpoint jadwal harian                                         | Rahasia     |
| `HAKKITA_DATA_DIR`                     | Folder data alternatif untuk skrip impor                                  | Opsional    |

`AI_GATEWAY_FALLBACK_MODEL` menerima beberapa ID model yang dipisahkan koma dan dicoba berurutan. Urutan lokal yang disarankan setelah model utama adalah `claude-opus-4-6-thinking,gpt-5.6-sol,qwen3.8-max-0902,gemini-3.8-flash-high`: utamakan reasoning dan kualitas draft, lalu kemampuan tool calling serta structured output untuk Radar. Harga bukan dasar utama urutan. ID tersebut mengikuti katalog gateway yang dipakai; kecocokan tiap alias tetap bergantung pada ketersediaan dan kompatibilitas gateway. Semua model tetap menggunakan `AI_GATEWAY_BASE_URL` dan `AI_API_KEY` yang sama; daftar ini membantu saat model tertentu bermasalah, bukan saat gateway atau kuncinya tidak tersedia.

Nilai dengan awalan `NEXT_PUBLIC_` memang digunakan browser dan tidak boleh berisi rahasia. Jangan pernah membagikan atau memasukkan kunci rahasia ke variabel tersebut. Aplikasi dan skrip impor membaca satu file `apps/web/.env.local`, jadi tidak perlu membuat salinan kedua di root repo. Di Vercel, masukkan variabel melalui **Project Settings → Environment Variables**, bukan melalui file repo.

Perintah lain:

```bash
pnpm check              # lint + typecheck + tes + validasi data
pnpm validate:data      # validasi data program dan wilayah (gagal bila ada galat)
pnpm validate:data:strict   # gagal juga bila ada entri belum diverifikasi atau usang
pnpm build && pnpm start    # build produksi lalu jalankan
```

## Fitur

### Progres saat ini

- **Kenali Hakmu:** Cari program di `/kenali-hakmu` berdasarkan wilayah, kategori, atau kata kunci.
- **Layanan Publik:** Cari panduan di `/layanan` berdasarkan wilayah, kategori, atau kata kunci.
- **Detail program dan layanan:** Baca ringkasan, persyaratan, dan langkah pengurusan. Halaman program juga mencantumkan sumber dan status verifikasi.
- **Berkas Siap Bawa:** Untuk KIP Kuliah, lihat daftar hal yang perlu disiapkan sesuai jawaban, catat kendala dan catatan pribadi, lalu cetak daftar pengingatnya. HAKKITA tidak membuat, menerima, atau mengirim dokumen. Saat masuk, jawaban, centang, dan catatan tersimpan di akun; tanpa akun, data berada di perangkat.
- **Rencanaku:** Simpan program, ikuti panduan langkah, catat persiapan berkas, dan lihat tenggat. Program tersimpan dan progres berkas terhubung ke akun saat masuk.
- **Masuk dan Daftar:** Masuk dengan email atau Google untuk menyimpan data ke akun. Informasi publik tetap bisa dijelajahi tanpa akun.
- **Ikuti program:** Ikuti program melalui halaman detailnya. Perubahan periode, syarat, atau dokumen yang tercatat pada data terverifikasi ditampilkan di Rencanaku setelah situs diperbarui. Pengguna dapat mengaktifkan pemberitahuan email untuk perubahan tersebut dan kabar resmi yang ditambahkan secara manual jika Supabase, Resend, dan jadwal harian sudah dikonfigurasi.
- **Periksa Kondisimu:** Jawab pertanyaan untuk melihat program yang mungkin sesuai dengan kriteria, alasan pencocokannya, dan tautan ke kanal resmi. Hasilnya hanya menunjukkan potensi kesesuaian.
- **Asisten:** Tanyakan program, panduan, atau kabar resmi. Asisten mencari bahan terkurasi saat dibutuhkan, menyertakan sumber, memahami halaman yang sedang dibuka, dan meminta persetujuan sebelum menyimpan program ke akun.
- **Data program:** 15 program dan layanan terverifikasi, termasuk KIP Kuliah, PKH, KTP elektronik, KJP Plus DKI Jakarta, dan program daerah di Aceh, Kalimantan Timur, Sulawesi Selatan, serta Papua Barat.
- **Telusuri Anggaran:** Lihat ringkasan APBN terbaru yang dicantumkan beserta periode dan sumbernya, atau buka data APBD di portal resmi SIKD.

### Fitur mendatang

- **Filter verifikasi:** Sembunyikan program yang belum diverifikasi.
- **Peta hambatan:** Lihat laporan kendala yang dirangkum menurut wilayah.
- **Cakupan data:** Tambah kriteria pencocokan dan rincian kabupaten/kota pada data wilayah.

## Struktur

```
apps/web/            Next.js: app/ (halaman), components/, features/, hooks/, config/, server/
packages/schema/     Skema zod, konstanta, dan tipe data bersama
packages/domain/     Logika murni dan diuji: wilayah, sumber, periode, program, pencarian,
                     pencocokan profil, simpanan, rencana, berkas
data/                Program dan layanan (YAML) serta wilayah (JSON)
scripts/             validate-data.ts
```

Aturan arsitektur utama: panah dependensi hanya ke bawah (halaman → fitur → komponen → domain → data), komponen tidak boleh mengimpor fitur, dan UI tidak boleh mengimpor `src/server` (ditegakkan ESLint dan `server-only`).

## Data dan sumber

Sumber yang digunakan sementara untuk data program dan wilayah saat ini:

- https://kip-kuliah.kemdiktisaintek.go.id/
- https://kip-kuliah.kemdiktisaintek.go.id/panduan
- https://kip-kuliah.kemdiktisaintek.go.id/siswa/pendaftaran/baru
- https://kemensos.go.id/
- https://bpsdm.acehprov.go.id/
- https://pendidikan.gratispol.kaltimprov.go.id/
- https://beasiswa.sulselprov.go.id/
- https://papuacerdas.papuabaratprov.go.id/
- https://dukcapil.kemendagri.go.id/
- https://jakarta.go.id/
- https://kemendagri.go.id/

### Bahan pencarian dan pemantauan sumber

Ringkasan panduan resmi yang sudah diperiksa tersimpan di `data/knowledge/`. Setiap bagian membawa URL sumber dan tanggal pemeriksaan. Asisten mencari bahan tersebut bersama persyaratan dan panduan berkas yang memiliki tautan sumber saat pertanyaan memerlukannya. Program dengan status `belum` tidak masuk ke bahan pencarian. Retrieval saat ini memakai pencocokan kata tanpa embedding.

Setelah migrasi `20261109110000_program_source_observations.sql` diterapkan, jalankan `pnpm import:data` lalu `pnpm import:knowledge` untuk mengisi Supabase. YAML tetap menjadi fallback ketika Supabase tidak tersedia. Perintah `pnpm validate:data` memeriksa bahan pencarian sekaligus data program.

Jadwal harian `/api/cron/program-sources` memeriksa apakah respons laman sumber berubah. Pemeriksaan pertama membuat titik pembanding. Perubahan berikutnya dicatat di `program_source_observations.changed_at` dan, setelah migrasi `20261110000000_program_radar_review.sql` diterapkan, masuk ke antrean privat `program_radar_candidates`. AI dapat menyiapkan draf dari halaman HTML bila kunci dan model tersedia. Perubahan HTML belum tentu berarti ketentuan berubah; draf bisa kosong dan selalu perlu diperiksa admin. Radar tidak mengubah syarat program.

Jadwal harian `/api/cron/program-discovery` mencari kandidat program baru melalui Tavily dengan batas domain `.go.id`, membaca halaman resminya, lalu meminta AI menyusun draf yang harus lolos skema program. Pencarian bergilir menurut kategori dan wilayah yang tersedia di `data/wilayah/wilayah.json`. Hasilnya masuk ke tabel privat `program_radar_program_candidates`, tidak tampil ke publik sampai admin menyetujui. Atur `TAVILY_API_KEY`, `AI_API_KEY`, `AI_GATEWAY_BASE_URL`, dan `RADAR_AI_MODEL` untuk menjalankannya. Migrasi `20261110170000_radar_program_discovery.sql` menyiapkan antrean privat dan persetujuan atomik.

Akun Supabase dengan email terverifikasi dan peran `admin` di tabel `user_roles` dapat membuka `/admin/validasi`, memeriksa sumber, menyunting judul, ringkasan, isi email dan tautan tambahan, lalu menyetujui atau menolak temuan. Pencarian program dan pemeriksaan sumber yang dijalankan dari panel berjalan di server dan statusnya disimpan di tabel `program_radar_runs`, jadi tetap berjalan walau tab ditutup. Pekerjaan dipecah menjadi potongan sekitar tiga menit yang saling menyambung (butuh `CRON_SECRET`), sehingga lama total tidak dibatasi durasi fungsi. Terapkan migrasi `20261111120000_radar_runs.sql` dan `20261111130000_radar_runs_resume.sql` agar fitur ini aktif. Temuan kabar yang disetujui masuk ke `program_news`; program baru yang disetujui langsung tampil dengan status terverifikasi dasar, dan admin dapat memperbaiki isinya lewat tombol Perbaiki sebelum menyetujui. Email bagi pengikut program tidak pernah dikirim otomatis: admin mengirimnya lewat tombol, untuk kabar program dari panel pratinjau di Validasi, dan untuk perubahan isi program dari tombol Kabari pengikut di halaman informasi. Jangan memasukkan kunci service role atau AI ke variabel `NEXT_PUBLIC_`.

Setelah pemeriksaan manual selesai dan data yang relevan sudah diimpor ulang, pembanding untuk satu URL dapat diterima melalui SQL Editor Supabase:

```sql
update public.program_source_observations
set baseline_fingerprint = latest_fingerprint,
    changed_at = null
where source_url = 'https://alamat-sumber-resmi.go.id/'
  and changed_at is not null;
```

## Privasi

HAKKITA tidak meminta NIK atau unggahan dokumen. Program tersimpan dan progres berkas menggunakan Supabase saat pengguna masuk; progres tanpa akun berada di perangkat. Jawaban profil tetap di perangkat. Informasi publik dapat dijelajahi tanpa akun. HAKKITA tidak menentukan penerima program dan tidak menghitung desil; pengecekan status resmi dilakukan di kanal pemerintah.
