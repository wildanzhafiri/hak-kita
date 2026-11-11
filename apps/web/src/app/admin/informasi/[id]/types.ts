import type { Program } from '@hakkita/schema';

export interface AdminInformationDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface PublishedInfoProps {
  program: Program;
  regionName: string;
}
