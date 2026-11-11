'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { AuthField } from './auth-field';
import { AUTH_SHARED_COPY as COPY } from './content';
import { AUTH_INPUT_CLASSES } from './constants';
import type { AuthPasswordFieldProps } from './types';

export function AuthPasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  value,
  error,
  isDisabled,
  onChange,
}: AuthPasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthField error={error} id={id} label={label}>
      <div className="relative">
        <TextInput
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`${AUTH_INPUT_CLASSES} pr-[50px]`}
          disabled={isDisabled}
          id={id}
          name={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={isVisible ? 'text' : 'password'}
          value={value}
        />
        <Button
          aria-controls={id}
          aria-label={isVisible ? COPY.hidePassword : COPY.showPassword}
          aria-pressed={isVisible}
          className="absolute right-[3px] top-[3px] !size-11 text-[#617087]"
          isDisabled={isDisabled}
          onPress={() => setIsVisible((current) => !current)}
          tone="icon"
          type="button"
        >
          {isVisible ? (
            <EyeOff aria-hidden="true" size={20} />
          ) : (
            <Eye aria-hidden="true" size={20} />
          )}
        </Button>
      </div>
    </AuthField>
  );
}
