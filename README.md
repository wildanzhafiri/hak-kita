# HAKKITA

Platform yang memandu warga mengurus program dan layanan pemerintah langkah demi langkah, lalu memetakan di langkah mana prosesnya paling sering tersendat. Setiap informasi bersumber resmi, bertanggal, dan jujur soal tingkat verifikasinya.

> Dikembangkan untuk **Web In Action, MIA 2026** (subtema: Public Service Tracking dan Data-Driven Decision Support) dan masih dalam pengerjaan.
> Data di repositori ini masih dalam proses verifikasi. Status tiap entri tertera pada berkasnya dan ditampilkan di web.

## Tech stack

| Lapisan   | Pilihan                                                            |
| --------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router) + React 19 + TypeScript (strict)           |
| UI        | Tailwind CSS 4, lucide-react                                       |
| Data      | Berkas YAML/JSON di repo (content-as-code), divalidasi dengan zod  |
| Logika    | Paket `domain` (TypeScript murni) diuji dengan Vitest              |
| Tes UI    | Vitest, jsdom, Testing Library                                     |
| Monorepo  | pnpm workspaces                                                    |
| Kualitas  | ESLint, Prettier, GitHub Actions (validasi data, lint, tes, build) |

Direncanakan (belum ada di kode): Supabase (Postgres) untuk laporan hambatan, Claude API untuk asisten, PWA offline.

## Cara menjalankan

Prasyarat: **Node.js 22.12 atau lebih baru** dan **pnpm 11** (`corepack enable` lalu pnpm mengikuti versi di `package.json`, atau `npm i -g pnpm`).

```bash
git clone <url-repositori-ini>
cd hakkita
pnpm install
pnpm dev
```

Buka http://localhost:3000. Tidak ada variabel lingkungan atau database yang dibutuhkan untuk menjalankan versi saat ini.

Konfigurasi lingkungan (baru dibutuhkan saat fitur AI dan Supabase dibangun): salin `.env.example` ke `apps/web/.env.local` dan isi nilainya. Berkas `.env.local` tidak pernah di-commit, dan kunci rahasia (`ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`) hanya dipakai di server, tanpa awalan `NEXT_PUBLIC_`.

Perintah lain:

```bash
pnpm check              # lint + typecheck + tes + validasi data
pnpm validate:data      # validasi data program dan wilayah (gagal bila ada galat)
pnpm validate:data:strict   # gagal juga bila ada entri belum diverifikasi atau usang
pnpm build && pnpm start    # build produksi lalu jalankan
```

## Progress saat ini

Sudah berjalan:

- [x] Monorepo (`apps/web`, `packages/schema`, `packages/domain`) dengan CI
- [x] Skema data bersama (zod): program, wilayah, sumber, tingkat verifikasi
- [x] Aturan sumber: sumber utama wajib `https` dan berdomain `.go.id`; tanggal diperiksa wajib untuk entri terverifikasi; data usang (>90 hari) diberi peringatan
- [x] Validator data (`pnpm validate:data`), 79 tes untuk paket `domain`, dan 33 tes komponen untuk `apps/web`
- [x] Wilayah berjenjang: Nasional → Provinsi → Kabupaten/Kota
- [x] **Beranda** dengan navigasi, pencarian, dan lima menu layanan
- [x] **Kenali Hakmu** (program) dan **Urus Kebutuhanmu** (layanan) dengan filter wilayah berjenjang, kategori, dan pencarian; tiap kartu menampilkan sumber resmi, tanggal diperiksa, status verifikasi, dan status periode (dibuka/ditutup)
- [x] Halaman detail program/layanan (ringkasan, persyaratan, langkah berikutnya), pencarian, **Tentang**, dan **Sumber & batasan data**
- [x] **Berkas siap bawa** untuk KIP Kuliah: pertanyaan singkat, daftar dokumen sesuai kondisi, kendala umum beserta langkahnya, catatan pribadi, dan lembar yang bisa dicetak atau disimpan sebagai PDF. Isinya tersimpan hanya di perangkat pengguna
- [x] 5 entri awal: KIP Kuliah berstatus **dasar** (diperiksa ke situs resminya), empat lainnya **belum diverifikasi**
- [x] Menu yang belum jadi (Periksa Kondisimu, Pantau Langkahmu, Awasi Uang Publik, Rencanaku) sudah punya halaman yang menjelaskan isinya

Direncanakan / dalam pengembangan:

- [ ] Profil terpadu (opsional, tanpa NIK) dan mesin aturan syarat dengan jejak penjelasan
- [ ] Rencana pengurusan dan pelacak langkah
- [ ] Peta hambatan per wilayah (laporan anonim dengan ambang minimal)
- [ ] Asisten AI (cerita bebas → profil → pencarian → rencana)
- [ ] Verifikasi data ke sumber resmi dan perluasan cakupan program dan wilayah
- [ ] Radar pemantau sumber resmi dengan tinjauan kurator

## Struktur

```
apps/web/            Next.js: app/ (halaman), components/, features/, hooks/, config/, server/
packages/schema/     Skema zod, konstanta, dan tipe data bersama
packages/domain/     Logika murni dan diuji: wilayah, sumber, periode, program, pencarian
data/                Program dan layanan (YAML) serta wilayah (JSON)
scripts/             validate-data.ts
```

Aturan arsitektur utama: panah dependensi hanya ke bawah (halaman → fitur → komponen → domain → data), komponen tidak boleh mengimpor fitur, dan UI tidak boleh mengimpor `src/server` (ditegakkan ESLint dan `server-only`).

## Data dan sumber

Setiap entri membawa sumber utama, tingkat verifikasi (`lengkap` / `dasar` / `belum`), dan tanggal diperiksa. Entri baru **harus** berstatus `belum` sampai isinya dibandingkan dengan sumber resmi.

## Privasi

Versi saat ini tidak meminta NIK, tidak meminta unggahan dokumen, tidak memakai akun, dan tidak mengirim data pengguna ke server mana pun. HAKKITA tidak menentukan kelayakan penerima dan tidak menghitung desil; pengecekan status resmi dilakukan di kanal pemerintah.
