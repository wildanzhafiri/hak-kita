import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import type { ButtonProps as HeroButtonProps } from '@heroui/react';

export type ButtonTone = 'primary' | 'secondary' | 'quiet' | 'icon' | 'danger';

export interface ButtonProps
  extends
    Omit<HeroButtonProps, 'variant'>,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'tabIndex'> {
  tone?: ButtonTone;
}

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string | null;
  options: readonly SelectOption[];
  isDisabled?: boolean;
  onChange: (value: string) => void;
}

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface ChoiceGroupProps {
  name: string;
  ariaLabel: string;
  value: string | null;
  options: readonly ChoiceOption[];
  layout?: 'cards' | 'pills';
  onChange: (value: string) => void;
}

export interface DialogProps {
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: string;
  closeLabel: string;
  children: ReactNode;
  side?: boolean;
}

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  label: string;
  items: readonly BreadcrumbEntry[];
}

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}

export interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  marker?: boolean;
}

export interface DataNoteProps {
  children?: ReactNode;
}

export interface SearchBarProps {
  inputLabel: string;
  placeholder: string;
  submitIcon: ReactNode;
  submitLabel?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export interface ProgressMeterProps {
  value: number;
  max: number;
  summary: string;
  label: string;
}

export interface DataTableRow {
  key: string;
  cells: ReactNode[];
}

export interface DataTableProps {
  columns: string[];
  rows: DataTableRow[];
}

export interface TurnstileProps {
  siteKey: string;
  resetKey: number;
  label: string;
  onToken: (token: string) => void;
}
