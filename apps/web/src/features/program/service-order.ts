import type { Program } from '@hakkita/schema';
import { SERVICE_PRIORITY } from './constants';

export function orderServices(services: Program[]): Program[] {
  const rank = (service: Program) => {
    const index = (SERVICE_PRIORITY as readonly string[]).indexOf(service.id);
    return index === -1 ? SERVICE_PRIORITY.length : index;
  };
  return [...services].sort((a, b) => rank(a) - rank(b));
}
