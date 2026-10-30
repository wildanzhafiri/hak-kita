import { ExternalLink } from 'lucide-react';
import type { OfficialSiteLinkProps } from './types';

export function OfficialSiteLink({ url, className }: OfficialSiteLinkProps) {
  return (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      Buka situs resmi <ExternalLink size={16} />
    </a>
  );
}
