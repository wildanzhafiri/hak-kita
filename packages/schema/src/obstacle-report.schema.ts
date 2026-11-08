import { z } from 'zod';
import { OBSTACLE_REPORT_STAGES } from './constants';
import { KodeWilayahSchema } from './wilayah.schema';

export const ObstacleReportSchema = z.object({
  programId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  stage: z.enum(OBSTACLE_REPORT_STAGES),
  regionCode: KodeWilayahSchema,
  turnstileToken: z.string().min(1).max(2048),
  consent: z.literal(true),
});
