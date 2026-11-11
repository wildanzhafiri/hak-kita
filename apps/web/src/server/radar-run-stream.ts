import 'server-only';
import { RADAR_RUN_FAILURE_MESSAGE, RADAR_RUN_STREAM_HEADERS } from './constants';
import type { RadarRunReporter } from './types';

export function streamRadarRun(
  run: (report: RadarRunReporter, signal: AbortSignal) => Promise<string>,
  requestSignal?: AbortSignal,
): Response {
  const encoder = new TextEncoder();
  const stopController = new AbortController();
  let isClosed = false;
  requestSignal?.addEventListener('abort', () => stopController.abort(), { once: true });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const report: RadarRunReporter = (event) => {
        if (isClosed) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      try {
        report({ type: 'finished', summary: await run(report, stopController.signal) });
      } catch {
        report({ type: 'failed', message: RADAR_RUN_FAILURE_MESSAGE });
      }
      if (!isClosed) controller.close();
    },
    cancel() {
      isClosed = true;
      stopController.abort();
    },
  });

  return new Response(stream, { headers: RADAR_RUN_STREAM_HEADERS });
}
