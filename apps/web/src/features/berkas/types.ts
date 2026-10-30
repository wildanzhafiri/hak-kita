import type {
  Berkas,
  BerkasDokumen,
  BerkasKendala,
  BerkasPertanyaan,
  Program,
} from '@hakkita/schema';
import type { BerkasAnswers, BerkasProgress, BerkasReadiness } from '@hakkita/domain';

export interface BerkasSheetProps {
  program: Program;
  berkas: Berkas;
  builtOn: string;
}

export interface UseBerkasProgressResult {
  progress: BerkasProgress;
  answer: (questionId: string, value: string) => void;
  toggle: (dokumenId: string) => void;
  setNote: (note: string) => void;
  reset: () => void;
}

export interface BerkasQuestionsProps {
  questions: BerkasPertanyaan[];
  answers: BerkasAnswers;
  onAnswer: (questionId: string, value: string) => void;
}

export interface BerkasChecklistProps {
  dokumen: BerkasDokumen[];
  checked: string[];
  hasUnanswered: boolean;
  onToggle: (dokumenId: string) => void;
}

export interface BerkasIssuesProps {
  kendala: BerkasKendala[];
}

export interface BerkasNoteProps {
  note: string;
  onChange: (note: string) => void;
}

export interface BerkasSummaryProps {
  program: Program;
  readiness: BerkasReadiness;
  onReset: () => void;
}

export interface BerkasPrintHeaderProps {
  program: Program;
  today: string;
}
