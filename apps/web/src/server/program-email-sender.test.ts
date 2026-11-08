import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendProgramEmail } from './program-email-sender';

vi.mock('server-only', () => ({}));

const message = {
  to: 'person@example.com',
  subject: 'Pembaruan program',
  text: 'Informasi berubah',
  html: '<p>Informasi berubah</p>',
  idempotencyKey: 'delivery-123',
};

describe('sendProgramEmail', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends HTML, plain text, and the inline logo with an idempotency key', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('EMAIL_FROM', 'HAKKITA <update@example.com>');
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: 'email-1' }) });
    vi.stubGlobal('fetch', fetchMock);

    await sendProgramEmail(message);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Idempotency-Key': 'delivery-123' }),
        body: expect.stringContaining('"content_id":"hakkita-logo"'),
      }),
    );
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('"html":"<p>Informasi berubah</p>"');
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('"text":"Informasi berubah"');
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('"content_type":"image/png"');
    expect(fetchMock.mock.calls[0]?.[1]?.body).toContain('"from":"HAKKITA <update@example.com>"');
  });

  it('rejects a provider failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('EMAIL_FROM', 'update@example.com');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(sendProgramEmail(message)).rejects.toThrow('Email provider returned 503');
  });
});
