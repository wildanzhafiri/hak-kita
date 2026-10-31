export const RENCANA_SUMMARY_CONTENT = {
  href: '/rencanaku',
  title: 'Lanjutkan dari tempat kamu berhenti.',
  description: 'Berkas, program tersimpan, dan tenggatmu dalam satu tempat.',
};

export const RENCANA_PAGE_CONTENT = [
  RENCANA_SUMMARY_CONTENT,
  {
    href: '/rencanaku/berkas',
    title: 'Berkas yang kamu siapkan',
    description: 'Lihat dokumen yang sudah kamu tandai dan lanjutkan persiapannya.',
  },
  {
    href: '/rencanaku/tersimpan',
    title: 'Program tersimpan',
    description: 'Kembali ke program yang ingin kamu pelajari atau urus.',
  },
  {
    href: '/rencanaku/tenggat',
    title: 'Tenggat program',
    description: 'Periksa tanggal dari program yang kamu simpan atau siapkan berkasnya.',
  },
] as const;
