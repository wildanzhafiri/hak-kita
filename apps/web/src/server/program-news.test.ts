import { describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { buildProgramNewsEmail, createProgramNewsEmailId } from './program-news';

vi.mock('server-only', () => ({}));

describe('program news email', () => {
  it('includes the official source, publication date and account setting', () => {
    const program = makeProgram();
    const news = {
      id: 'news-1',
      program_id: program.id,
      title: 'Pengumuman pendaftaran program',
      summary: 'Instansi penyelenggara menerbitkan pengumuman baru tentang pendaftaran program.',
      source_url: 'https://contoh.go.id/pengumuman',
      published_on: '2026-11-08',
      created_at: '2026-11-08T10:00:00Z',
      email_text: null,
      extra_source_urls: [],
    };
    const key = createProgramNewsEmailId('user-1', news.id);
    const email = buildProgramNewsEmail(
      'person@example.com',
      program,
      news,
      'https://hakkita.example',
      key,
    );

    expect(email.subject).toContain(news.title);
    expect(email.text).toContain(news.summary);
    expect(email.text).toContain('8 November 2026');
    expect(email.text).toContain(news.source_url);
    expect(email.html).toContain(news.title);
    expect(email.html).toContain('8 November 2026');
    expect(email.html).toContain(news.source_url);
    expect(email.html).toContain(program.sumberUtama.url);
    expect(email.text).toContain('https://hakkita.example/rencanaku');
    expect(email.idempotencyKey).toBe(key);
    expect(key).not.toBe(createProgramNewsEmailId('user-2', news.id));
  });

  it('includes an optional note and avoids a duplicate source link', () => {
    const program = makeProgram({
      sumberUtama: { url: 'https://contoh.go.id/pengumuman', jenis: 'situs-resmi' },
    });
    const news = {
      id: 'news-2',
      program_id: program.id,
      title: 'Kabar layanan',
      summary: 'Informasi dari penyelenggara.',
      source_url: program.sumberUtama.url,
      published_on: '2026-11-08',
      created_at: '2026-11-08T10:00:00Z',
      email_text: null,
      extra_source_urls: [],
    };
    const email = buildProgramNewsEmail(
      'person@example.com',
      program,
      news,
      'https://hakkita.example',
      'key',
      { title: 'Pesan untukmu', body: 'Periksa pengumuman sebelum bertindak.' },
    );

    expect(email.text).toContain('Pesan untukmu: Periksa pengumuman sebelum bertindak.');
    expect(email.html).toContain('Pesan untukmu');
    expect(email.html.match(/https:\/\/contoh.go.id\/pengumuman/g)).toHaveLength(1);
  });

  it('uses the reviewed email copy and includes additional official sources', () => {
    const program = makeProgram();
    const email = buildProgramNewsEmail(
      'person@example.com',
      program,
      {
        id: 'news-3',
        program_id: program.id,
        title: 'Jadwal pendaftaran diperbarui',
        summary: 'Ringkasan untuk halaman program yang sudah diperiksa admin.',
        email_text: 'Pendaftaran sekarang mengikuti jadwal pada pengumuman terbaru penyelenggara.',
        source_url: 'https://contoh.go.id/pengumuman',
        extra_source_urls: ['https://instansi.go.id/jadwal'],
        published_on: '2026-11-08',
        created_at: '2026-11-08T10:00:00Z',
      },
      'https://hakkita.example',
      'key',
    );

    expect(email.text).toContain('Pendaftaran sekarang mengikuti jadwal');
    expect(email.text).not.toContain('Ringkasan untuk halaman program');
    expect(email.text).toContain('https://instansi.go.id/jadwal');
    expect(email.html).toContain('https://instansi.go.id/jadwal');
  });
});
