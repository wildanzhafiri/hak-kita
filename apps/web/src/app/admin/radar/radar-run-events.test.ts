import type { RadarRunEvent } from '@hakkita/schema';
import { describe, expect, it } from 'vitest';
import { readRadarRunEvents } from './radar-run-events';

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

async function collect(chunks: string[]): Promise<RadarRunEvent[]> {
  const events: RadarRunEvent[] = [];
  await readRadarRunEvents(streamOf(chunks), (event) => events.push(event));
  return events;
}

describe('readRadarRunEvents', () => {
  it('reads an event that is split across chunks', async () => {
    const events = await collect([
      '{"type":"drafting",',
      '"index":2}\n{"type":"finished","summary":"Selesai"}\n',
    ]);

    expect(events).toEqual([
      { type: 'drafting', index: 2 },
      { type: 'finished', summary: 'Selesai' },
    ]);
  });

  it('reads a final event that has no trailing newline', async () => {
    const events = await collect(['{"type":"failed","message":"Gagal"}']);

    expect(events).toEqual([{ type: 'failed', message: 'Gagal' }]);
  });

  it('skips lines that are not valid events', async () => {
    const events = await collect([
      'bukan json\n{"type":"unknown"}\n\n{"type":"drafting","index":0}\n',
    ]);

    expect(events).toEqual([{ type: 'drafting', index: 0 }]);
  });
});
