import { describe, expect, it, vi } from 'vitest';
import { createProgramFollowSnapshot } from '@hakkita/domain';
import { makeProgram } from '@/test/fixtures';
import {
  buildProgramEmail,
  buildProgramFollowEmail,
  createProgramEmailId,
  resolveProgramEmailBaseline,
} from './program-email';

vi.mock('server-only', () => ({}));

const followedAt = '2026-11-06T00:00:00Z';
const current = makeProgram({ syarat: [{ teks: 'Syarat baru' }] });
const previous = makeProgram();
const follow = {
  user_id: 'user-1',
  program_id: current.id,
  snapshot: createProgramFollowSnapshot(previous, '2026-11-06'),
  created_at: followedAt,
  updated_at: followedAt,
};
const currentSnapshot = createProgramFollowSnapshot(current, '2026-11-07');

describe('program email notifications', () => {
  it('starts from current data when email was enabled after following', () => {
    const baseline = resolveProgramEmailBaseline(
      null,
      '2026-11-07T00:00:00Z',
      follow,
      currentSnapshot,
    );
    expect(baseline).toEqual({ snapshot: currentSnapshot, shouldSeed: true });
  });

  it('uses the follow snapshot when email was enabled before following', () => {
    const baseline = resolveProgramEmailBaseline(
      null,
      '2026-11-05T00:00:00Z',
      follow,
      currentSnapshot,
    );
    expect(baseline).toEqual({ snapshot: follow.snapshot, shouldSeed: true });
  });

  it('resets the baseline after email is reenabled', () => {
    const baseline = resolveProgramEmailBaseline(
      { snapshot: follow.snapshot, updated_at: '2026-11-06T12:00:00Z' },
      '2026-11-07T00:00:00Z',
      follow,
      currentSnapshot,
    );
    expect(baseline).toEqual({ snapshot: currentSnapshot, shouldSeed: true });
  });

  it('builds a sourced message and stable delivery key', () => {
    const key = createProgramEmailId('user-1', current.id, followedAt, currentSnapshot);
    expect(key).toBe(createProgramEmailId('user-1', current.id, followedAt, currentSnapshot));
    expect(key).not.toBe(createProgramEmailId('user-2', current.id, followedAt, currentSnapshot));
    const email = buildProgramEmail(
      'person@example.com',
      current,
      ['syarat'],
      follow.snapshot,
      'https://hakkita.example',
      key,
    );
    expect(email.subject).toContain(current.nama);
    expect(email.text).toContain('Persyaratan berubah');
    expect(email.text).toContain('Kini tercantum: Syarat baru');
    expect(email.text).toContain('Tidak lagi tercantum:');
    expect(email.text).toContain(current.sumberUtama.url);
    expect(email.text).toContain('https://hakkita.example/rencanaku');
    expect(email.html).toContain('Persyaratan berubah');
    expect(email.html).toContain('Syarat baru');
    expect(email.html).toContain('cid:hakkita-logo');
    expect(email.idempotencyKey).toBe(key);
  });

  it('builds a followed-program message without preview wording', () => {
    const email = buildProgramFollowEmail(
      'person@example.com',
      current,
      'https://hakkita.example',
      'follow-123',
    );
    expect(email.subject).toContain(current.nama);
    expect(email.subject).not.toContain('percobaan');
    expect(email.text).not.toContain('percobaan');
    expect(email.html).toContain('Pemberitahuan email');
    expect(email.html).toContain(current.sumberUtama.url);
    expect(email.idempotencyKey).toBe('follow-123');
  });
});
