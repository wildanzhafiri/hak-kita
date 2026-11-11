import { ExternalLink } from 'lucide-react';
import type { OfficialSiteLinkProps } from './types';

export function OfficialSiteLink({
  url,
  className,
  label = 'Buka situs resmi',
}: OfficialSiteLinkProps) {
  return (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      {label} <ExternalLink size={16} />
    </a>
  );
}
