import { AUTH_FIELD_ERROR_COPY } from './content';
import { MIN_PASSWORD_LENGTH, NAME_MAX_LENGTH } from './constants';
import type { AuthFieldErrors, AuthFieldValues, AuthFormKind } from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthFields(kind: AuthFormKind, fields: AuthFieldValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (kind === 'signup') {
    if (!fields.name.trim()) errors.name = AUTH_FIELD_ERROR_COPY.nameRequired;
    else if (fields.name.trim().length > NAME_MAX_LENGTH) {
      errors.name = AUTH_FIELD_ERROR_COPY.nameTooLong;
    }
  }
  if (!fields.email.trim()) errors.email = AUTH_FIELD_ERROR_COPY.emailRequired;
  else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = AUTH_FIELD_ERROR_COPY.emailInvalid;
  }
  if (kind !== 'recovery') {
    if (!fields.password) errors.password = AUTH_FIELD_ERROR_COPY.passwordRequired;
    else if (kind === 'signup' && fields.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = AUTH_FIELD_ERROR_COPY.passwordTooShort;
    }
  }
  return errors;
}
