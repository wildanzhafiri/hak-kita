export interface ProgramDetailPageProps {
  id: string;
  layanan: boolean;
}

export interface ProgramCatalogPageProps {
  layanan: boolean;
  initialQuery?: string;
  initialCategory?: string;
}
