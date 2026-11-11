'use client';

import { isLayanan } from '@hakkita/domain';
import { ProgramDetailProgram } from './program-detail-program';
import { ServiceDetail } from './service-detail';
import type { ProgramDetailProps } from './types';

export function ProgramDetail({ program, namaCakupan, related = [] }: ProgramDetailProps) {
  if (isLayanan(program)) {
    return <ServiceDetail program={program} namaCakupan={namaCakupan} related={related} />;
  }

  return <ProgramDetailProgram program={program} namaCakupan={namaCakupan} />;
}
