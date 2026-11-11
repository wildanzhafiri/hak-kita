import type { ReactNode } from 'react';
import type { Recommendation } from '@hakkita/domain';
import type { AktivitasProfil, Kategori, PreferensiProfil, Wilayah } from '@hakkita/schema';

export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ProfileState {
  status: ProfileStatus;
  nama: string;
  preferensi: PreferensiProfil;
}

export interface ProfileContextValue extends ProfileState {
  save: (nama: string, preferensi: PreferensiProfil) => Promise<string | null>;
  clearPreferences: () => Promise<string | null>;
}

export interface ProfileProviderProps {
  children: ReactNode;
}

export interface ProfileStoreResult {
  nama: string;
  preferensi: PreferensiProfil;
  error: string | null;
}

export interface RegionOption {
  kode: string;
  nama: string;
}

export interface ProfileRegions {
  provinces: RegionOption[];
  citiesByProvince: Record<string, RegionOption[]>;
}

export interface AccountAvatarProps {
  nama: string;
  email: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ProfileScreenProps {
  wilayah: Wilayah[];
}

export interface ProfileChoiceFieldsProps {
  heading: string;
  hint: string;
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  values: readonly string[];
  onToggle: (value: string) => void;
  children?: ReactNode;
}

export interface UnsavedChangesDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export interface AccountGateProps {
  title: string;
  next: string;
}

export interface ProfileSummaryRow {
  label: string;
  value: string;
  note?: string;
}

export interface ProfileSummaryProps {
  rows: ProfileSummaryRow[];
}

export interface ProfilePageProps extends ProfileScreenProps {
  isSaved: boolean;
}

export interface ProfileDraft {
  nama: string;
  provinsi: string;
  kota: string;
  kegiatan: AktivitasProfil[];
  kegiatanLain: string;
  pendidikan: string;
  minat: Kategori[];
}

export interface ProfileEditorProps extends ProfileScreenProps {
  fromProfile: boolean;
}

export interface ProfileEditorFormProps {
  regions: ProfileRegions;
  initialDraft: ProfileDraft;
  hadName: boolean;
  fromProfile: boolean;
}

export interface RecommendationCardProps {
  recommendation: Recommendation;
}

export interface ProfileRegionFieldsProps {
  regions: ProfileRegions;
  provinsi: string;
  kota: string;
  isDisabled: boolean;
  onChange: (provinsi: string, kota: string) => void;
}
