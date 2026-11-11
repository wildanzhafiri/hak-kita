import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({ verifyTurnstileToken: vi.fn() }));

vi.mock('server-only', () => ({}));
vi.mock('@/server/assistant-rate-limit', () => ({ checkAssistantRateLimit: () => 0 }));
vi.mock('@/server/turnstile', () => ({ verifyTurnstileToken: mocks.verifyTurnstileToken }));

import { POST } from './route';

const environmentKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'TURNSTILE_SECRET_KEY',
  'AI_API_KEY',
  'AI_GATEWAY_BASE_URL',
  'AI_GATEWAY_MODEL',
  'TOOL_APPROVAL_SECRET',
] as const;
const initialEnvironment = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key]]),
);

function createRequest(turnstileToken?: string) {
  return new NextRequest('http://localhost/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ id: 'message-1', role: 'user', parts: [{ type: 'text', text: 'Halo' }] }],
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
  });
}

describe('assistant route security', () => {
  afterEach(() => {
    vi.clearAllMocks();
    environmentKeys.forEach((key) => {
      const value = initialEnvironment[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  });

  it('requires verification from signed-out visitors', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';

    const response = await POST(createRequest());

    expect(response.status).toBe(400);
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
  });

  it('verifies the visitor token against the request host and chat action', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    mocks.verifyTurnstileToken.mockResolvedValue('valid');

    const response = await POST(createRequest('verified-token'));

    expect(mocks.verifyTurnstileToken).toHaveBeenCalledWith({
      token: 'verified-token',
      secret: 'test-secret',
      hostname: 'localhost',
      action: 'assistant_chat',
    });
    expect(response.status).toBe(503);
  });
});
