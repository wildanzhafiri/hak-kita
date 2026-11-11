import { describe, expect, it } from 'vitest';
import { validateAuthFields } from './validate-auth-fields';

const empty = { name: '', email: '', password: '' };

describe('validateAuthFields', () => {
  it('asks for an email and a password when signing in', () => {
    expect(validateAuthFields('login', empty)).toEqual({
      email: 'Masukkan alamat email.',
      password: 'Masukkan kata sandi.',
    });
  });

  it('accepts a valid sign-in without asking for a name', () => {
    expect(
      validateAuthFields('login', { name: '', email: ' budi@contoh.id ', password: 'x' }),
    ).toEqual({});
  });

  it('also asks for a display name when registering', () => {
    expect(validateAuthFields('signup', empty).name).toBe('Masukkan nama tampilan.');
    expect(
      validateAuthFields('signup', { name: 'A'.repeat(61), email: 'a@b.id', password: '12345678' })
        .name,
    ).toBe('Gunakan nama tampilan maksimal 60 karakter.');
  });

  it('asks for a password of at least eight characters when registering only', () => {
    const fields = { name: 'Budi', email: 'budi@contoh.id', password: '1234567' };

    expect(validateAuthFields('signup', fields).password).toBe(
      'Gunakan kata sandi minimal 8 karakter.',
    );
    expect(validateAuthFields('login', fields).password).toBeUndefined();
  });

  it('checks the email format', () => {
    expect(validateAuthFields('recovery', { ...empty, email: 'bukan-email' }).email).toBe(
      'Periksa kembali format alamat email.',
    );
  });

  it('only needs an email to recover access', () => {
    expect(validateAuthFields('recovery', { ...empty, email: 'budi@contoh.id' })).toEqual({});
  });
});
