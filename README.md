# HAKKITA

Platform yang memandu warga mengurus program dan layanan pemerintah langkah demi langkah. Informasi program dilengkapi rujukan dan keterangan verifikasi, dan kelak situs ini akan memetakan di langkah mana prosesnya paling sering tersendat.

## Tech stack

| Lapisan   | Pilihan                                                            |
| --------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript (strict)           |
| UI        | HeroUI v3, Tailwind CSS 4, lucide-react                         |
| Data      | Berkas YAML/JSON di repo (content-as-code), divalidasi dengan zod  |
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
- **Berkas Siap Bawa:** Untuk KIP Kuliah, lihat daftar dokumen sesuai jawaban, catat kendala dan catatan pribadi, lalu cetak daftarnya. Data tersimpan di browser.
- **Rencanaku:** Simpan program, catat persiapan berkas, dan lihat tenggat. Data tersimpan di browser.
- **Masuk dan Daftar:** Halaman akun belum tersedia. HAKKITA tetap dapat digunakan tanpa akun.
- **Periksa Kondisimu:** Jawab pertanyaan untuk melihat program yang mungkin sesuai dengan kriteria, alasan pencocokannya, dan tautan ke kanal resmi. Hasilnya hanya menunjukkan potensi kesesuaian.
- **Data program:** KIP Kuliah, PKH, Kartu Prakerja, KTP elektronik, dan KJP Plus DKI Jakarta.
- **Pantau Langkahmu dan Telusuri Anggaran:** Halaman saat ini menjelaskan fitur yang sedang disiapkan.

### Fitur mendatang

- **Profil awal:** Isi profil singkat atau lewati langkah ini.
- **Filter verifikasi:** Sembunyikan program yang belum diverifikasi.
- **Ikuti program:** Terima pemberitahuan saat periode atau persyaratan berubah.
- **Pantau Langkahmu:** Catat langkah pengurusan dan pantau beberapa program.
- **Peta hambatan:** Lihat laporan kendala yang dirangkum menurut wilayah.
- **Telusuri Anggaran:** Lihat anggaran dan realisasi beserta sumber dan tahunnya.
- **Asisten AI agentik:** Memahami cerita pengguna, merangkum profil untuk dikonfirmasi, mencari program, dan menyusun rencana. Dengan tool calling, asisten dapat melakukan tindakan di HAKKITA, seperti menyimpan program atau memperbarui rencana, setelah pengguna menyetujui. Tindakan dapat dibatalkan; asisten tidak mengajukan layanan ke situs pemerintah.
- **Cakupan data:** Tambah kriteria pencocokan serta data program dan wilayah.
- **Pemantauan sumber:** Periksa perubahan di situs resmi sebelum memperbarui informasi.

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

## Privasi

Versi saat ini tidak meminta NIK, tidak meminta unggahan dokumen, tidak memakai akun, dan tidak mengirim data pengguna ke server mana pun. HAKKITA tidak menentukan kelayakan penerima dan tidak menghitung desil; pengecekan status resmi dilakukan di kanal pemerintah.
