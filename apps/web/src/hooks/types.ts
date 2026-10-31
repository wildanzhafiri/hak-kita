export interface UseSavedIdsResult {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}
