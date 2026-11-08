import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RencanaEmailPreference } from './rencana-email-preference';

const preference = vi.hoisted(() => ({
  enabled: false,
  isLoading: false,
  isSaving: false,
  error: null as string | null,
  setEnabled: vi.fn(),
  retry: vi.fn(),
}));

vi.mock('@/hooks/use-email-notification-preference', () => ({
  useEmailNotificationPreference: () => preference,
}));

describe('RencanaEmailPreference', () => {
  beforeEach(() => {
    preference.enabled = false;
    preference.isLoading = false;
    preference.error = null;
    preference.setEnabled.mockClear();
  });

  it('asks for explicit opt-in before email is enabled', () => {
    render(<RencanaEmailPreference />);
    const button = screen.getByRole('button', { name: 'Aktifkan email' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button);
    expect(preference.setEnabled).toHaveBeenCalledWith(true);
  });

  it('allows email to be disabled', () => {
    preference.enabled = true;
    render(<RencanaEmailPreference />);
    fireEvent.click(screen.getByRole('button', { name: 'Matikan email' }));
    expect(preference.setEnabled).toHaveBeenCalledWith(false);
  });
});
