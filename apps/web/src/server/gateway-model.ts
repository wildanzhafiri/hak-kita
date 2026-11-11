import type { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createFallbackModel } from './fallback-model';
import type { GatewayLanguageModel } from './types';

type Gateway = ReturnType<typeof createOpenAICompatible>;

export function listGatewayModelNames(primary: string): string[] {
  const configured = [
    process.env.AI_GATEWAY_MODEL,
    ...(process.env.AI_GATEWAY_FALLBACK_MODEL ?? '').split(','),
  ]
    .map((name) => name?.trim())
    .filter((name): name is string => Boolean(name));
  return [...new Set([primary, ...configured])];
}

export function createGatewayModel(gateway: Gateway, primary: string): GatewayLanguageModel {
  const [first, ...rest] = listGatewayModelNames(primary).map((name) => gateway.chatModel(name));
  return createFallbackModel([first as GatewayLanguageModel, ...rest]);
}
