import type { NextRequest } from 'next/server';
import { runProgramEmailNotifications } from '@/server/program-email-notifications';
import { sendProgramEmailPreview } from '@/server/program-email-preview';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const testEmail = searchParams.get('testEmail');
  const isPreview = searchParams.get('preview') === '1';
  if (process.env.NODE_ENV === 'development' && !testEmail) {
    return Response.json({ error: 'A test email is required in development' }, { status: 400 });
  }
  if (process.env.NODE_ENV !== 'development' && (testEmail || isPreview)) {
    return Response.json({ error: 'Scoped runs are unavailable' }, { status: 400 });
  }
  if (testEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
    return Response.json({ error: 'Invalid test email' }, { status: 400 });
  }

  try {
    if (isPreview && testEmail) {
      await sendProgramEmailPreview(testEmail);
      return Response.json({ previewSent: true });
    }
    const result = await runProgramEmailNotifications(
      testEmail ? { onlyRecipientEmail: testEmail } : {},
    );
    return Response.json(result, { status: result.failed > 0 ? 503 : 200 });
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : error !== null &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string'
          ? error.message
          : null;
    const showDetail = Boolean(testEmail && isPreview) || process.env.NODE_ENV === 'development';
    const message = showDetail && detail ? detail : 'Email notification run failed';
    return Response.json({ error: message }, { status: 503 });
  }
}
