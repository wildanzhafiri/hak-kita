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
pnpm dev
```

Buka http://localhost:3000. Tidak ada variabel lingkungan atau database yang dibutuhkan untuk menjalankan versi saat ini.

Konfigurasi lingkungan belum diperlukan untuk menjalankan versi saat ini. Jika integrasi yang memerlukan kunci diaktifkan, salin `.env.example` ke `apps/web/.env.local`. Jangan commit `.env.local` atau mengekspos kunci rahasia di kode sisi browser.

Perintah lain:

```bash
pnpm check              # lint + typecheck + tes + validasi data
pnpm validate:data      # validasi data program dan wilayah (gagal bila ada galat)
pnpm validate:data:strict   # gagal juga bila ada entri belum diverifikasi atau usang
pnpm build && pnpm start    # build produksi lalu jalankan
```

## Fitur

### Progres saat ini

- **Kenali Hakmu:** Cari program di `/program` berdasarkan wilayah, kategori, atau kata kunci.
- **Layanan Publik:** Cari panduan di `/layanan` berdasarkan wilayah, kategori, atau kata kunci.
- **Detail program dan layanan:** Baca ringkasan, persyaratan, dan langkah pengurusan. Halaman program juga mencantumkan sumber dan status verifikasi.
- **Berkas Siap Bawa:** Untuk KIP Kuliah, lihat daftar dokumen sesuai jawaban, catat kendala dan catatan pribadi, lalu cetak daftarnya. Jawaban dan catatan tersimpan di browser; centang berkas tersinkron ke akun saat masuk.
- **Rencanaku:** Simpan program, ikuti panduan langkah, catat persiapan berkas, dan lihat tenggat. Program tersimpan dan progres centang berkas terhubung ke akun saat masuk; jawaban dan catatan berkas tetap di browser.
- **Masuk dan Daftar:** Masuk dengan email atau Google untuk menyimpan data ke akun. Informasi publik tetap bisa dijelajahi tanpa akun.
- **Ikuti program:** Ikuti program melalui halaman detailnya. Perubahan periode, syarat, atau dokumen yang tercatat pada data terverifikasi ditampilkan di Rencanaku setelah situs diperbarui. Pengguna dapat mengaktifkan pemberitahuan email untuk perubahan tersebut dan kabar resmi yang ditambahkan secara manual jika Supabase, Resend, dan jadwal harian sudah dikonfigurasi.
- **Periksa Kondisimu:** Jawab pertanyaan untuk melihat program yang mungkin sesuai dengan kriteria, alasan pencocokannya, dan tautan ke kanal resmi. Hasilnya hanya menunjukkan potensi kesesuaian.
- **Asisten:** Tanyakan program, panduan, atau kabar resmi. Asisten mencari bahan terkurasi saat dibutuhkan, menyertakan sumber, memahami halaman yang sedang dibuka, dan meminta persetujuan sebelum menyimpan program ke akun.
- **Data program:** KIP Kuliah, PKH, Kartu Prakerja, KTP elektronik, dan KJP Plus DKI Jakarta.
- **Telusuri Anggaran:** Lihat ringkasan APBN terbaru yang dicantumkan beserta periode dan sumbernya, atau buka data APBD di portal resmi SIKD.

### Fitur mendatang

- **Filter verifikasi:** Sembunyikan program yang belum diverifikasi.
- **Peta hambatan:** Lihat laporan kendala yang dirangkum menurut wilayah.
- **Cakupan data:** Tambah kriteria pencocokan serta data program dan wilayah.

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
- https://www.prakerja.go.id/
- https://dukcapil.kemendagri.go.id/
- https://jakarta.go.id/
- https://kemendagri.go.id/

### Bahan pencarian dan pemantauan sumber

Ringkasan panduan resmi yang sudah diperiksa tersimpan di `data/knowledge/`. Setiap bagian membawa URL sumber dan tanggal pemeriksaan. Asisten mencari bahan tersebut bersama persyaratan dan panduan berkas yang memiliki tautan sumber saat pertanyaan memerlukannya. Program dengan status `belum` tidak masuk ke bahan pencarian. Retrieval saat ini memakai pencocokan kata tanpa embedding.

Setelah migrasi `20261109110000_program_source_observations.sql` diterapkan, jalankan `pnpm import:data` lalu `pnpm import:knowledge` untuk mengisi Supabase. YAML tetap menjadi fallback ketika Supabase tidak tersedia. Perintah `pnpm validate:data` memeriksa bahan pencarian sekaligus data program.

Jadwal harian `/api/cron/program-sources` memeriksa apakah respons laman sumber berubah. Pemeriksaan pertama membuat titik pembanding; perubahan berikutnya tercatat di `program_source_observations.changed_at`. Perubahan HTML belum tentu berarti ketentuan berubah. Periksa sumber resmi dan sunting data terkurasi sebelum menjadikan respons baru sebagai titik pembanding. Pemeriksaan ini tidak mengubah syarat program atau mengirim pemberitahuan kepada pengguna secara otomatis.

Setelah pemeriksaan manual selesai dan data yang relevan sudah diimpor ulang, pembanding untuk satu URL dapat diterima melalui SQL Editor Supabase:

```sql
update public.program_source_observations
set baseline_fingerprint = latest_fingerprint,
    changed_at = null
where source_url = 'https://alamat-sumber-resmi.go.id/'
  and changed_at is not null;
```

## Privasi

HAKKITA tidak meminta NIK atau unggahan dokumen. Program yang disimpan, progres berkas, dan jawaban profil yang dipilih untuk disimpan ke akun menggunakan Supabase; informasi publik tetap dapat dijelajahi tanpa akun. HAKKITA tidak menentukan penerima program dan tidak menghitung desil; pengecekan status resmi dilakukan di kanal pemerintah.
