import { MODEL_COOLDOWN_MS } from './constants';
import type { GatewayLanguageModel } from './types';

export function createFallbackModel(
  models: readonly [GatewayLanguageModel, ...GatewayLanguageModel[]],
  now: () => number = Date.now,
): GatewayLanguageModel {
  const [primary] = models;
  const unavailableUntil = new Map<GatewayLanguageModel, number>();

  async function run<Result>(
    abortSignal: AbortSignal | undefined,
    call: (model: GatewayLanguageModel) => PromiseLike<Result>,
  ): Promise<Result> {
    const available = models.filter((model) => (unavailableUntil.get(model) ?? 0) <= now());
    const candidates = available.length > 0 ? available : models;
    let lastError: unknown;
    for (const model of candidates) {
      try {
        const result = await call(model);
        unavailableUntil.delete(model);
        return result;
      } catch (error) {
        if (abortSignal?.aborted) throw error;
        lastError = error;
        unavailableUntil.set(model, now() + MODEL_COOLDOWN_MS);
      }
    }
    throw lastError;
  }

  return {
    specificationVersion: primary.specificationVersion,
    provider: primary.provider,
    modelId: primary.modelId,
    get supportedUrls() {
      return primary.supportedUrls;
    },
    doGenerate: (options) => run(options.abortSignal, (model) => model.doGenerate(options)),
    doStream: (options) => run(options.abortSignal, (model) => model.doStream(options)),
  } as GatewayLanguageModel;
}
