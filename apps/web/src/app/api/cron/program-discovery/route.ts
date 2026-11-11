import type { NextRequest } from 'next/server';
import { runProgramDiscovery } from '@/server/radar-program-discovery';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runProgramDiscovery();
    return Response.json(result, { status: result.failed.length > 0 ? 503 : 200 });
  } catch {
    return Response.json({ error: 'Program discovery failed' }, { status: 503 });
  }
}
