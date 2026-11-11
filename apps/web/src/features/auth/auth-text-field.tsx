'use client';

import { TextInput } from '@/components/ui/text-input';
import { AuthField } from './auth-field';
import { AUTH_INPUT_CLASSES } from './constants';
import type { AuthTextFieldProps } from './types';

export function AuthTextField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  inputMode,
  maxLength,
  value,
  error,
  isDisabled,
  onChange,
}: AuthTextFieldProps) {
  return (
    <AuthField error={error} id={id} label={label}>
      <TextInput
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={AUTH_INPUT_CLASSES}
        disabled={isDisabled}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </AuthField>
  );
}
