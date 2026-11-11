export const ASSISTANT_INTRO =
  'Tanya soal program, panduan layanan, kabar resmi, atau anggaran. Jawaban akan menyertakan sumber yang dipakai.';

export const ASSISTANT_PROMPTS = [
  'Jelaskan halaman yang sedang dibuka',
  'Cari bantuan pendidikan',
  'Syarat mengurus paspor',
  'Cara membuat NPWP',
] as const;

export const ASSISTANT_DETAIL_PROMPTS = [
  'Jelaskan halaman yang sedang dibuka',
  'Apa persyaratannya?',
  'Dokumen yang perlu disiapkan',
  'Bagaimana cara mengaksesnya?',
] as const;

export const ASSISTANT_COPY = {
  title: 'Asisten HAKKITA',
  subtitle: 'Bantu cari program dan layanan publik',
  welcomeTitle: 'Ada Yang Bisa Kami Bantu?',
  welcomeIntro: 'Tanyakan program, persyaratan, atau panduan layanan yang kamu butuhkan.',
  promptsLabel: 'Butuh bantuan mencari panduan layanan?',
  topicPrompt: (topic: string) => `Ada yang ingin kamu tanyakan tentang ${topic}?`,
  placeholder: 'Tulis pertanyaanmu...',
  inputLabel: 'Tulis pertanyaan',
  send: 'Kirim pesan',
  close: 'Tutup asisten',
  open: 'Buka asisten HAKKITA',
  newConversation: 'Percakapan baru',
  conversation: 'Percakapan',
} as const;

export const ASSISTANT_ERROR_COPY =
  'Pesan belum terkirim. Periksa koneksi atau konfigurasi asisten, lalu coba lagi.';

export const ASSISTANT_LOADING_COPY = 'Menyusun jawaban untukmu';

export const ASSISTANT_SECURITY_COPY = 'Menyiapkan pengiriman pesan';
