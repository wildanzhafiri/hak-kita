export interface SourceInformationEntry {
  id: string;
  name: string;
  agency: string;
  checkedAt: string | null;
  sourceUrl: string;
}

export interface SourceInformationListProps {
  entries: SourceInformationEntry[];
}
