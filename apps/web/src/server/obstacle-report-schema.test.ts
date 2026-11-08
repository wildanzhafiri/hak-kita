import { describe, expect, it } from 'vitest';
import { ObstacleReportSchema } from '@hakkita/schema';

const report = {
  programId: 'kip-kuliah',
  stage: 'menyiapkan-berkas',
  regionCode: '31',
  turnstileToken: 'turnstile-token',
  consent: true,
};

describe('ObstacleReportSchema', () => {
  it('accepts an opted-in report with an allowed stage and region code', () => {
    expect(ObstacleReportSchema.safeParse(report).success).toBe(true);
  });

  it('rejects reports without explicit consent or with an unknown stage', () => {
    expect(ObstacleReportSchema.safeParse({ ...report, consent: false }).success).toBe(false);
    expect(ObstacleReportSchema.safeParse({ ...report, stage: 'other' }).success).toBe(false);
  });
});
