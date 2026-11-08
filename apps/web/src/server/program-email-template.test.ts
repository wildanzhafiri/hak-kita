import { describe, expect, it, vi } from 'vitest';
import { renderProgramEmailHtml } from './program-email-template';

vi.mock('server-only', () => ({}));

describe('program email template', () => {
  it('escapes program content and links while keeping the brand and actions', () => {
    const html = renderProgramEmailHtml({
      heading: 'Kabar <baru>',
      intro: 'Informasi & jadwal',
      programName: 'Program <script>alert(1)</script>',
      contextLabel: 'Kabar resmi',
      contextTitle: 'Pendaftaran "dibuka"',
      contextBody: 'Lihat syarat <terbaru>',
      details: [{ title: 'Dokumen', notes: ['Surat & kartu'] }],
      actionLabel: 'Lihat program',
      actionUrl: 'https://hakkita.example/program?id=1&ref=email',
      sources: [
        { label: 'Pengumuman <resmi>', url: 'https://contoh.go.id/sumber' },
        { label: 'Laman program', url: 'https://contoh.go.id/program?x=1&y=2' },
      ],
      note: { title: 'Pesan untukmu', body: 'Periksa <kondisi> & jadwal' },
      settingsUrl: 'https://hakkita.example/rencanaku',
    });

    expect(html).toContain('cid:hakkita-logo');
    expect(html).toContain('Kabar &lt;baru&gt;');
    expect(html).toContain('Informasi &amp; jadwal');
    expect(html).toContain('Program &lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('https://hakkita.example/program?id=1&amp;ref=email');
    expect(html).toContain('Surat &amp; kartu');
    expect(html).toContain('https://contoh.go.id/sumber');
    expect(html).toContain('https://contoh.go.id/program?x=1&amp;y=2');
    expect(html).toContain('Pengumuman &lt;resmi&gt;');
    expect(html).toContain('Periksa &lt;kondisi&gt; &amp; jadwal');
    expect(html).toContain('border-left:4px');
    expect(html).not.toContain('<script>');
  });

  it('omits the optional message when none is provided', () => {
    const html = renderProgramEmailHtml({
      heading: 'Kabar program',
      intro: 'Ringkasan',
      programName: 'KIP Kuliah',
      contextLabel: 'Isi pengumuman',
      actionLabel: 'Lihat program',
      actionUrl: 'https://hakkita.example/program/kip-kuliah',
      sources: [{ label: 'Laman resmi', url: 'https://kip-kuliah.kemdiktisaintek.go.id/' }],
      settingsUrl: 'https://hakkita.example/rencanaku',
    });

    expect(html).not.toContain('border-left:4px');
    expect(html).toContain('Kabar KIP Kuliah');
  });
});
