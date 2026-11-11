import { describe, expect, it, vi } from 'vitest';
import { createFallbackModel } from './fallback-model';
import type { GatewayLanguageModel } from './types';

function fakeModel(id: string, behavior: 'ok' | 'fail') {
  const doStream = vi.fn(async () => {
    if (behavior === 'fail') throw new Error(`${id} unavailable`);
    return { stream: id } as never;
  });
  const model = {
    specificationVersion: 'v4',
    provider: 'test',
    modelId: id,
    supportedUrls: {},
    doGenerate: vi.fn(),
    doStream,
  } as unknown as GatewayLanguageModel;
  return { model, doStream };
}

const options = {} as never;

describe('createFallbackModel', () => {
  it('uses the primary model when it works', async () => {
    const primary = fakeModel('haiku', 'ok');
    const backup = fakeModel('luna', 'ok');
    const model = createFallbackModel([primary.model, backup.model]);

    await expect(model.doStream(options)).resolves.toEqual({ stream: 'haiku' });
    expect(backup.doStream).not.toHaveBeenCalled();
  });

  it('switches to the next model when the primary fails', async () => {
    const primary = fakeModel('haiku', 'fail');
    const backup = fakeModel('luna', 'ok');
    const model = createFallbackModel([primary.model, backup.model]);

    await expect(model.doStream(options)).resolves.toEqual({ stream: 'luna' });
    expect(primary.doStream).toHaveBeenCalledTimes(1);
  });

  it('skips a failed model until its cooldown ends', async () => {
    const primary = fakeModel('haiku', 'fail');
    const backup = fakeModel('luna', 'ok');
    let time = 0;
    const model = createFallbackModel([primary.model, backup.model], () => time);

    await model.doStream(options);
    await model.doStream(options);
    expect(primary.doStream).toHaveBeenCalledTimes(1);

    time = 61_000;
    await model.doStream(options);
    expect(primary.doStream).toHaveBeenCalledTimes(2);
  });

  it('throws the last error when every model fails', async () => {
    const model = createFallbackModel([
      fakeModel('haiku', 'fail').model,
      fakeModel('luna', 'fail').model,
    ]);

    await expect(model.doStream(options)).rejects.toThrow('luna unavailable');
  });

  it('does not fall back when the request was aborted', async () => {
    const primary = fakeModel('haiku', 'fail');
    const backup = fakeModel('luna', 'ok');
    const controller = new AbortController();
    controller.abort();
    const model = createFallbackModel([primary.model, backup.model]);

    await expect(model.doStream({ abortSignal: controller.signal } as never)).rejects.toThrow(
      'haiku unavailable',
    );
    expect(backup.doStream).not.toHaveBeenCalled();
  });
});
