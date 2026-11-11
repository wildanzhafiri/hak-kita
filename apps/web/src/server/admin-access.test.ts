import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRadarAccessState } from './admin-access';

vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ getAll: vi.fn(), set: vi.fn() })),
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  })),
}));

describe('radar admin access', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'publishable-key');
    mocks.getUser.mockReset();
    mocks.from.mockReset();
    mocks.maybeSingle.mockReset();
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: mocks.maybeSingle,
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('authorizes only users with the admin role', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id', email: 'adminkita@hakkita.com', email_confirmed_at: 'now' } },
      error: null,
    });
    mocks.maybeSingle.mockResolvedValue({ data: { role: 'admin' }, error: null });

    await expect(getRadarAccessState()).resolves.toEqual({
      status: 'authorized',
      userId: 'admin-id',
      email: 'adminkita@hakkita.com',
    });
    expect(mocks.from).toHaveBeenCalledWith('user_roles');
    expect(mocks.maybeSingle).toHaveBeenCalledOnce();
  });

  it('denies signed-in users without an admin role', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-id', email_confirmed_at: 'now' } },
      error: null,
    });
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(getRadarAccessState()).resolves.toEqual({ status: 'forbidden' });
  });

  it('requires a confirmed email before checking the role', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id', email_confirmed_at: null } },
      error: null,
    });

    await expect(getRadarAccessState()).resolves.toEqual({ status: 'forbidden' });
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('reports missing role storage as an admin setup issue', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'admin-id', email_confirmed_at: 'now' } },
      error: null,
    });
    mocks.maybeSingle.mockResolvedValue({ data: null, error: { message: 'Missing table' } });

    await expect(getRadarAccessState()).resolves.toEqual({ status: 'unconfigured' });
  });
});
