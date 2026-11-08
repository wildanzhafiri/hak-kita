import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET } from './route';

const runNotifications = vi.hoisted(() => vi.fn());
const sendPreview = vi.hoisted(() => vi.fn());
vi.mock('@/server/program-email-notifications', () => ({
  runProgramEmailNotifications: runNotifications,
}));
vi.mock('@/server/program-email-preview', () => ({
  sendProgramEmailPreview: sendPreview,
}));

describe('program email cron', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    runNotifications.mockReset();
    sendPreview.mockReset();
  });

  it('rejects calls without the secret', async () => {
    vi.stubEnv('CRON_SECRET', 'secret-123');
    const request = {
      headers: new Headers(),
      url: 'http://localhost/api/cron/program-email',
    } as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(401);
    expect(runNotifications).not.toHaveBeenCalled();
  });

  it('runs only with the secret', async () => {
    vi.stubEnv('CRON_SECRET', 'secret-123');
    runNotifications.mockResolvedValue({ checked: 2, sent: 1, failed: 0 });
    const request = {
      headers: new Headers({ authorization: 'Bearer secret-123' }),
      url: 'http://localhost/api/cron/program-email',
    } as NextRequest;
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ checked: 2, sent: 1, failed: 0 });
    expect(runNotifications).toHaveBeenCalledWith({});
  });

  it('requires a recipient and limits a development run to that address', async () => {
    vi.stubEnv('CRON_SECRET', 'secret-123');
    vi.stubEnv('NODE_ENV', 'development');
    runNotifications.mockResolvedValue({ checked: 1, sent: 1, failed: 0 });
    const headers = new Headers({ authorization: 'Bearer secret-123' });
    const unscoped = await GET({
      headers,
      url: 'http://localhost/api/cron/program-email',
    } as NextRequest);
    expect(unscoped.status).toBe(400);
    expect(runNotifications).not.toHaveBeenCalled();

    const scoped = await GET({
      headers,
      url: 'http://localhost/api/cron/program-email?testEmail=person%40example.com',
    } as NextRequest);
    expect(scoped.status).toBe(200);
    expect(runNotifications).toHaveBeenCalledWith({ onlyRecipientEmail: 'person@example.com' });
  });

  it('sends a preview only to the selected account in development', async () => {
    vi.stubEnv('CRON_SECRET', 'secret-123');
    vi.stubEnv('NODE_ENV', 'development');
    sendPreview.mockResolvedValue(undefined);
    const response = await GET({
      headers: new Headers({ authorization: 'Bearer secret-123' }),
      url: 'http://localhost/api/cron/program-email?testEmail=person%40example.com&preview=1',
    } as NextRequest);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ previewSent: true });
    expect(sendPreview).toHaveBeenCalledWith('person@example.com');
    expect(runNotifications).not.toHaveBeenCalled();
  });

  it('returns the cause when a scoped preview fails', async () => {
    vi.stubEnv('CRON_SECRET', 'secret-123');
    vi.stubEnv('NODE_ENV', 'development');
    sendPreview.mockRejectedValue({ message: 'The account does not follow a program' });
    const response = await GET({
      headers: new Headers({ authorization: 'Bearer secret-123' }),
      url: 'http://localhost/api/cron/program-email?testEmail=person%40example.com&preview=1',
    } as NextRequest);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'The account does not follow a program' });
  });
});
