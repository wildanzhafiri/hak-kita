import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { UIMessage } from 'ai';
import { AssistantMessage } from './assistant-message';

describe('AssistantMessage', () => {
  it('shows an approval action before saving a program', () => {
    const onApproval = vi.fn();
    const message: UIMessage = {
      id: 'reply',
      role: 'assistant',
      parts: [{
        type: 'tool-saveProgramToPlan',
        toolCallId: 'save-1',
        state: 'approval-requested',
        input: { programId: 'kip-kuliah' },
        approval: { id: 'approve-1' },
      }],
    };

    render(<AssistantMessage isApprovalReady message={message} onApproval={onApproval} onNavigate={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Simpan program' }));

    expect(onApproval).toHaveBeenCalledWith('approve-1', true);
  });

  it('shows a saved result and a safe internal program link', () => {
    const message: UIMessage = {
      id: 'reply',
      role: 'assistant',
      parts: [
        { type: 'tool-saveProgramToPlan', toolCallId: 'save-1', state: 'output-available', input: { programId: 'kip-kuliah' }, output: { saved: true, programId: 'kip-kuliah', programName: 'KIP Kuliah' } },
        { type: 'tool-searchCatalog', toolCallId: 'search-1', state: 'output-available', input: { query: 'KIP Kuliah' }, output: { results: [{ name: 'KIP Kuliah', href: '/program/kip-kuliah', sourceUrl: 'https://kip-kuliah.kemdiktisaintek.go.id' }] } },
      ],
    };

    render(<AssistantMessage isApprovalReady message={message} onApproval={() => undefined} onNavigate={() => undefined} />);

    expect(screen.getByText('KIP Kuliah tersimpan di Rencanaku.')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'KIP Kuliah' }).map((link) => link.getAttribute('href'))).toContain('/program/kip-kuliah');
  });
});
