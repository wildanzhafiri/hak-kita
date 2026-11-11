import type { NextRequest } from 'next/server';
import { RadarAdminControlSchema } from '@hakkita/schema';
import { getRadarAdminId } from '@/server/admin-access';
import { runProgramDiscovery } from '@/server/radar-program-discovery';
import { runProgramSourceMonitor } from '@/server/program-source-monitor';
import { streamRadarRun } from '@/server/radar-run-stream';
import { loadRadarSettings, updateRadarSetting } from '@/server/radar-settings';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  if (!(await getRadarAdminId()))
    return Response.json({ error: 'Tidak diizinkan' }, { status: 403 });
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 403 });
  }
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 1000) {
      return Response.json({ error: 'Isi terlalu panjang' }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
  const parsed = RadarAdminControlSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: 'Perintah Radar tidak valid' }, { status: 400 });

  try {
    if (parsed.data.action === 'automatic_discovery') {
      await updateRadarSetting('automatic_discovery_enabled', parsed.data.enabled);
      return Response.json({ settings: await loadRadarSettings() });
    }
    if (parsed.data.action === 'monitoring') {
      await updateRadarSetting('monitoring_enabled', parsed.data.enabled);
      return Response.json({ settings: await loadRadarSettings() });
    }
    if (parsed.data.action === 'run_discovery') {
      return streamRadarRun(async (report, signal) => {
        const result = await runProgramDiscovery(true, report, signal);
        const failedNote = result.failed.length > 0 ? `, ${result.failed.length} gagal` : '';
        return `Pencarian selesai: ${result.searched} pencarian dan ${result.queued} kandidat baru${failedNote}.`;
      }, request.signal);
    }
    return streamRadarRun(async (report, signal) => {
      const result = await runProgramSourceMonitor(true, report, signal);
      return `Pemeriksaan selesai: ${result.checked} sumber diperiksa, ${result.changed.length} berubah, ${result.failed.length} gagal.`;
    }, request.signal);
  } catch {
    return Response.json(
      { error: 'Radar gagal dijalankan. Periksa konfigurasi dan coba lagi.' },
      { status: 503 },
    );
  }
}
