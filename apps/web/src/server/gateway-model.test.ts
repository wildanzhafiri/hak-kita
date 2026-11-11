import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFallbackModel } from './fallback-model';
import { listGatewayModelNames } from './gateway-model';
import type { GatewayLanguageModel } from './types';

const KEYS = ['AI_GATEWAY_MODEL', 'AI_GATEWAY_FALLBACK_MODEL'] as const;
const initial = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  KEYS.forEach((key) => {
    const value = initial[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  });
});

describe('listGatewayModelNames', () => {
  it('puts the requested model first, then the main and backup models without repeats', () => {
    process.env.AI_GATEWAY_MODEL = 'claude-haiku-5.5';
    process.env.AI_GATEWAY_FALLBACK_MODEL = 'gpt-5.6-luna-pro, auto';

    expect(listGatewayModelNames('gpt-5.6-luna-pro')).toEqual([
      'gpt-5.6-luna-pro',
      'claude-haiku-5.5',
      'auto',
    ]);
  });

  it('works with only the requested model configured', () => {
    delete process.env.AI_GATEWAY_MODEL;
    delete process.env.AI_GATEWAY_FALLBACK_MODEL;

    expect(listGatewayModelNames('claude-haiku-5.5')).toEqual(['claude-haiku-5.5']);
  });
});

describe('failed model memory', () => {
  function fakeModel(modelId: string, works: boolean) {
    const doStream = vi.fn(async () => {
      if (!works) throw new Error(`${modelId} unavailable`);
      return { stream: modelId } as never;
    });
    return {
      model: { specificationVersion: 'v4', provider: 'test', modelId, doStream } as never,
      doStream,
    };
  }

  it('is shared between separate requests, so a down model is not retried at once', async () => {
    const down = fakeModel('shared-down', false);
    const up = fakeModel('shared-up', true);
    const options = {} as never;

    await createFallbackModel([down.model, up.model] as never).doStream(options);
    await createFallbackModel([down.model, up.model] as never).doStream(options);

    expect(down.doStream).toHaveBeenCalledTimes(1);
    expect(up.doStream).toHaveBeenCalledTimes(2);
  });

  it('keeps the model type usable as a gateway language model', () => {
    const model = createFallbackModel([fakeModel('type-check', true).model] as never);
    const asGateway: GatewayLanguageModel = model;

    expect(asGateway.modelId).toBe('type-check');
  });
});
