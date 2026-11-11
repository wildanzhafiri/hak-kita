import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthNavAction } from './auth-nav-action';

const mocks = vi.hoisted(() => ({ user: null as { id: string } | null }));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));

describe('AuthNavAction', () => {
  beforeEach(() => {
    mocks.user = null;
  });

  it('offers sign in to a guest and keeps the page to return to', () => {
    render(<AuthNavAction currentPath="/rencanaku" />);

    expect(screen.getByRole('link', { name: 'Masuk' }).getAttribute('href')).toBe(
      '/masuk?next=%2Frencanaku',
    );
  });

  it('shows the account menu it is given to a signed-in person', () => {
    mocks.user = { id: 'user-1' };
    render(<AuthNavAction accountMenu={<p>Menu akun</p>} currentPath="/" />);

    expect(screen.getByText('Menu akun')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Masuk' })).toBeNull();
  });

  it('leaves the account actions to the mobile menu for a signed-in person', () => {
    mocks.user = { id: 'user-1' };
    const { container } = render(
      <AuthNavAction accountMenu={<p>Menu akun</p>} currentPath="/" variant="sheet" />,
    );

    expect(container.textContent).toBe('');
  });
});
