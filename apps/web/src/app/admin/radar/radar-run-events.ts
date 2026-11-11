import { RadarRunEventSchema, type RadarRunEvent } from '@hakkita/schema';

function parseRadarRunLine(line: string): RadarRunEvent | null {
  if (line.trim() === '') return null;
  try {
    const parsed = RadarRunEventSchema.safeParse(JSON.parse(line));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function readRadarRunEvents(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: RadarRunEvent) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffered = '';
  for (;;) {
    const { value, done } = await reader.read();
    buffered += decoder.decode(value, { stream: !done });
    const lines = buffered.split('\n');
    buffered = lines.pop() ?? '';
    for (const line of lines) {
      const event = parseRadarRunLine(line);
      if (event) onEvent(event);
    }
    if (done) break;
  }
  const lastEvent = parseRadarRunLine(buffered);
  if (lastEvent) onEvent(lastEvent);
}
