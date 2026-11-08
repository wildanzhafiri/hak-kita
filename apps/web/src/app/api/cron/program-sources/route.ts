import type { NextRequest } from 'next/server';
import { runProgramSourceMonitor } from '@/server/program-source-monitor';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runProgramSourceMonitor();
    return Response.json(result, { status: result.failed.length > 0 ? 503 : 200 });
  } catch {
    return Response.json({ error: 'Program source monitoring failed' }, { status: 503 });
  }
}
