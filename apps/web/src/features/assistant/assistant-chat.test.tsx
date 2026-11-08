import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AssistantChat } from './assistant-chat';

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  addToolApprovalResponse: vi.fn(),
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/program/kip-kuliah' }));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: { id: 'user-1' } }) }));
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
  it('sends a question with the current page when Enter is pressed', () => {
    render(<AssistantChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Buka asisten HAKKITA' }));
    const input = screen.getByRole('textbox', { name: 'Tulis pertanyaan' });
    fireEvent.change(input, { target: { value: 'Jelaskan program ini' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mocks.sendMessage).toHaveBeenCalledWith(
      { text: 'Jelaskan program ini' },
      { body: { turnstileToken: '', currentPath: '/program/kip-kuliah' } },
    );
  });
});
