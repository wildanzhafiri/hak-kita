import { describe, expect, it } from 'vitest';
import { profileDisplayName, profileInitials } from './profile-initials';

describe('profileInitials', () => {
  it('uses the first letters of the first two words of the name', () => {
    expect(profileInitials('Wildan Zhafiri Putra', 'a@b.id')).toBe('WZ');
    expect(profileInitials('  siti  ', 'a@b.id')).toBe('S');
  });

  it('falls back to the part of the email before the at sign', () => {
    expect(profileInitials('', 'budi.santoso@contoh.id')).toBe('B');
  });

  it('never returns an empty badge', () => {
    expect(profileInitials('', '')).toBe('?');
  });
});

describe('profileDisplayName', () => {
  it('shows the name when there is one and the email otherwise', () => {
    expect(profileDisplayName('Budi', 'budi@contoh.id')).toBe('Budi');
    expect(profileDisplayName('  ', 'budi@contoh.id')).toBe('budi@contoh.id');
  });
});
