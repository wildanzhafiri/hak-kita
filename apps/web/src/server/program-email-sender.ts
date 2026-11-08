import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PROGRAM_EMAIL_LOGO_CONTENT_ID } from './constants';
import type { ProgramEmailMessage } from './types';

export async function sendProgramEmail(message: ProgramEmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('Email provider is not configured');
  const senderAddress = from.match(/<([^>]+)>/)?.[1] ?? from.trim();
  const logo = await readFile(path.join(process.cwd(), 'public', 'hakkita-logo.png'));

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': message.idempotencyKey,
    },
    body: JSON.stringify({
      from: `HAKKITA <${senderAddress}>`,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: [
        {
          filename: 'hakkita-logo.png',
          content: logo.toString('base64'),
          content_type: 'image/png',
          content_id: PROGRAM_EMAIL_LOGO_CONTENT_ID,
        },
      ],
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || !('id' in result) || typeof result.id !== 'string') {
    throw new Error('Email provider did not confirm delivery');
  }
}
