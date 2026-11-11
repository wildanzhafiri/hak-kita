import { ASSISTANT_DETAIL_ROOTS, ASSISTANT_TITLE_SUFFIX } from './constants';

export function readPageTopic(pathname: string, documentTitle: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const isDetail =
    segments.length >= 2 && ASSISTANT_DETAIL_ROOTS.some((root) => root === segments[0]);
  if (!isDetail) return null;
  const topic = documentTitle.endsWith(ASSISTANT_TITLE_SUFFIX)
    ? documentTitle.slice(0, -ASSISTANT_TITLE_SUFFIX.length)
    : documentTitle;
  return topic.trim() || null;
}
