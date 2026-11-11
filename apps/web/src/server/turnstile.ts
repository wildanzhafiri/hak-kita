import 'server-only';

interface VerificationResponse {
  success: boolean;
  hostname?: string;
  action?: string;
}

export type TurnstileVerification = 'valid' | 'invalid' | 'unavailable';

export async function verifyTurnstileToken({
  token,
  secret,
  hostname,
  action,
}: {
  token: string;
  secret: string;
  hostname: string;
  action: string;
}): Promise<TurnstileVerification> {
  const body = new URLSearchParams({ secret, response: token });

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return 'unavailable';

    const result = (await response.json()) as VerificationResponse;
    if (!result.success) return 'invalid';
    return result.hostname === hostname && result.action === action ? 'valid' : 'invalid';
  } catch {
    return 'unavailable';
  }
}
