import { ValidationPreview } from '@/app/admin/validasi/validation-preview';
import { ValidationSection } from '@/app/admin/validasi/validation-section';
import { ValidationSources } from '@/app/admin/validasi/validation-sources';
import { PUBLISHED_INFO_COPY as COPY } from './content';
import { buildPublishedInfoRows } from './published-info-rows';
import type { PublishedInfoProps } from './types';

function readHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function PublishedInfo({ program, regionName }: PublishedInfoProps) {
  const sources = [program.sumberUtama, ...program.sumberTambahan].map((source) => ({
    label: readHost(source.url),
    url: source.url,
    quotes: source.kutipan ? [source.kutipan] : [],
  }));

  return (
    <>
      <ValidationSection title={COPY.heading}>
        <ValidationPreview rows={buildPublishedInfoRows(program, regionName)} />
      </ValidationSection>
      <ValidationSection title={COPY.sourcesHeading}>
        <ValidationSources sources={sources} />
      </ValidationSection>
    </>
  );
}
