import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssistantChat } from './assistant-chat';

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  addToolApprovalResponse: vi.fn(),
  user: { id: 'user-1' } as { id: string } | null,
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/kenali-hakmu/kip-kuliah' }));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('@/components/ui/turnstile', () => ({
  Turnstile: ({ onToken }: { onToken: (token: string) => void }) => (
    <button type="button" onClick={() => onToken('verified-token')}>
      Simulate security verification
    </button>
  ),
}));
vi.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: mocks.sendMessage,
    addToolApprovalResponse: mocks.addToolApprovalResponse,
    setMessages: vi.fn(),
    status: 'ready',
    error: null,
  }),
}));

describe('AssistantChat', () => {
  beforeEach(() => {
    mocks.sendMessage.mockClear();
    mocks.addToolApprovalResponse.mockClear();
    mocks.user = { id: 'user-1' };
  });

  it('sends a question with the current page when Enter is pressed', () => {
    render(<AssistantChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Buka asisten HAKKITA' }));
    const input = screen.getByRole('textbox', { name: 'Tulis pertanyaan' });
    fireEvent.change(input, { target: { value: 'Jelaskan program ini' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mocks.sendMessage).toHaveBeenCalledWith(
      { text: 'Jelaskan program ini' },
      { body: { currentPath: '/kenali-hakmu/kip-kuliah' } },
    );
  });

  it('allows a guest to send after security verification', () => {
    mocks.user = null;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
    render(<AssistantChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Buka asisten HAKKITA' }));

    const input = screen.getByRole('textbox', { name: 'Tulis pertanyaan' });
    fireEvent.change(input, { target: { value: 'Apa itu KIP Kuliah?' } });
    expect(screen.getByRole('button', { name: 'Kirim pesan' }).hasAttribute('disabled')).toBe(
      false,
    );
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Menyiapkan pengiriman pesan')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Simulate security verification' }));

    expect(mocks.sendMessage).toHaveBeenCalledWith(
      { text: 'Apa itu KIP Kuliah?' },
      { body: { currentPath: '/kenali-hakmu/kip-kuliah', turnstileToken: 'verified-token' } },
    );
    mocks.user = { id: 'user-1' };
  });
});
