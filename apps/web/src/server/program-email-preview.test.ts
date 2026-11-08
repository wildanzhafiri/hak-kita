import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { sendProgramEmailPreview } from './program-email-preview';

const createClient = vi.hoisted(() => vi.fn());
const sendEmail = vi.hoisted(() => vi.fn());
vi.mock('server-only', () => ({}));
vi.mock('@supabase/supabase-js', () => ({ createClient }));
vi.mock('./program-email-sender', () => ({ sendProgramEmail: sendEmail }));

function mockClient(hasFollow: boolean) {
  const program = makeProgram({
    id: 'kip-kuliah',
    nama: 'KIP Kuliah',
    sumberUtama: { url: 'https://kip-kuliah.kemdiktisaintek.go.id/', jenis: 'situs-resmi' },
  });
  const preferencesQuery = {
    select: () => preferencesQuery,
    eq: () => preferencesQuery,
    order: () => preferencesQuery,
    range: async () => ({ data: [{ user_id: 'user-1' }], error: null }),
  };
  const followsQuery = {
    select: () => followsQuery,
    eq: () => followsQuery,
    order: () => followsQuery,
    limit: () => followsQuery,
    maybeSingle: async () => ({ data: hasFollow ? { program_id: program.id } : null, error: null }),
  };
  const programsQuery = {
    select: () => programsQuery,
    eq: () => programsQuery,
    single: async () => ({ data: { record: program }, error: null }),
  };
  createClient.mockReturnValue({
    from: (table: string) => {
      if (table === 'program_email_preferences') return preferencesQuery;
      if (table === 'program_follows') return followsQuery;
      return programsQuery;
    },
    auth: {
      admin: {
        getUserById: async () => ({
          data: { user: { email: 'person@example.com', email_confirmed_at: '2026-11-07' } },
          error: null,
        }),
      },
    },
  });
  return program;
}

describe('program email preview', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    createClient.mockReset();
    sendEmail.mockReset();
  });

  it('sends a sourced KIP Kuliah announcement with a recipient note', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    vi.stubEnv('HAKKITA_SITE_URL', 'http://localhost:3000');
    vi.stubEnv('RESEND_API_KEY', 'resend-key');
    vi.stubEnv('EMAIL_FROM', 'HAKKITA <onboarding@resend.dev>');
    const program = mockClient(true);
    sendEmail.mockResolvedValue(undefined);

    await sendProgramEmailPreview('person@example.com');

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'person@example.com',
        subject: expect.stringContaining('Bank penyalur KIP Kuliah'),
        text: expect.stringContaining('LLDIKTI Wilayah III'),
        html: expect.stringContaining('Tanyakan proses rekening dan pencairan kepada kampusmu'),
      }),
    );
    const message = sendEmail.mock.calls[0]?.[0];
    expect(message?.html).toContain('lldikti3.kemdiktisaintek.go.id');
    expect(message?.html).toContain(program.sumberUtama.url);
    expect(message?.html).not.toContain('percobaan');
  });

  it('does not send without a followed program', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    vi.stubEnv('HAKKITA_SITE_URL', 'http://localhost:3000');
    vi.stubEnv('RESEND_API_KEY', 'resend-key');
    vi.stubEnv('EMAIL_FROM', 'HAKKITA <onboarding@resend.dev>');
    mockClient(false);

    await expect(sendProgramEmailPreview('person@example.com')).rejects.toThrow(
      'The account does not follow KIP Kuliah',
    );
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
