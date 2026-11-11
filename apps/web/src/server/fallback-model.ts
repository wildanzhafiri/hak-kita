import { MODEL_COOLDOWN_MS } from './constants';
import type { GatewayLanguageModel } from './types';

const sharedCooldowns = new Map<string, number>();

function modelKey(model: GatewayLanguageModel): string {
  return `${model.provider}/${model.modelId}`;
}

export function createFallbackModel(
  models: readonly [GatewayLanguageModel, ...GatewayLanguageModel[]],
  now: () => number = Date.now,
  unavailableUntil: Map<string, number> = sharedCooldowns,
): GatewayLanguageModel {
  const [primary] = models;

  async function run<Result>(
    abortSignal: AbortSignal | undefined,
    call: (model: GatewayLanguageModel) => PromiseLike<Result>,
  ): Promise<Result> {
    const available = models.filter(
      (model) => (unavailableUntil.get(modelKey(model)) ?? 0) <= now(),
    );
    const candidates = available.length > 0 ? available : models;
    let lastError: unknown;
    for (const model of candidates) {
      try {
        const result = await call(model);
        unavailableUntil.delete(modelKey(model));
        return result;
      } catch (error) {
        if (abortSignal?.aborted) throw error;
        lastError = error;
        unavailableUntil.set(modelKey(model), now() + MODEL_COOLDOWN_MS);
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
