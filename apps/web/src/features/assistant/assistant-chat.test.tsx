import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssistantChat } from './assistant-chat';

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  addToolApprovalResponse: vi.fn(),
  user: { id: 'user-1' } as { id: string } | null,
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/program/kip-kuliah' }));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));
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
      { body: { currentPath: '/program/kip-kuliah' } },
    );
  });

  it('does not require a user account to use the assistant', () => {
    mocks.user = null;
    render(<AssistantChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Buka asisten HAKKITA' }));

    expect(screen.getByText(/Kamu bisa bertanya tanpa masuk/)).toBeTruthy();
    const input = screen.getByRole('textbox', { name: 'Tulis pertanyaan' });
    fireEvent.change(input, { target: { value: 'Apa itu KIP Kuliah?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mocks.sendMessage).toHaveBeenCalledWith(
      { text: 'Apa itu KIP Kuliah?' },
      { body: { currentPath: '/program/kip-kuliah' } },
    );
    mocks.user = { id: 'user-1' };
  });
});
