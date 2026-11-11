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
      parts: [
        {
          type: 'tool-saveProgramToPlan',
          toolCallId: 'save-1',
          state: 'approval-requested',
          input: { programId: 'kip-kuliah' },
          approval: { id: 'approve-1' },
        },
      ],
    };

    render(
      <AssistantMessage
        isApprovalReady
        message={message}
        onApproval={onApproval}
        onNavigate={() => undefined}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Simpan program' }));

    expect(onApproval).toHaveBeenCalledWith('approve-1', true);
  });

  it('shows a saved result and a safe internal program link', () => {
    const message: UIMessage = {
      id: 'reply',
      role: 'assistant',
      parts: [
        {
          type: 'tool-saveProgramToPlan',
          toolCallId: 'save-1',
          state: 'output-available',
          input: { programId: 'kip-kuliah' },
          output: { saved: true, programId: 'kip-kuliah', programName: 'KIP Kuliah' },
        },
        {
          type: 'tool-searchCatalog',
          toolCallId: 'search-1',
          state: 'output-available',
          input: { query: 'KIP Kuliah' },
          output: {
            results: [
              {
                name: 'KIP Kuliah',
                href: '/kenali-hakmu/kip-kuliah',
                sourceUrl: 'https://kip-kuliah.kemdiktisaintek.go.id',
              },
            ],
          },
        },
      ],
    };

    render(
      <AssistantMessage
        isApprovalReady
        message={message}
        onApproval={() => undefined}
        onNavigate={() => undefined}
      />,
    );

    expect(screen.getByText('KIP Kuliah tersimpan di Rencanaku.')).toBeTruthy();
    expect(
      screen.getAllByRole('link', { name: 'KIP Kuliah' }).map((link) => link.getAttribute('href')),
    ).toContain('/kenali-hakmu/kip-kuliah');
  });

  const lookupMessage: UIMessage = {
    id: 'reply',
    role: 'assistant',
    parts: [
      {
        type: 'tool-searchCatalog',
        toolCallId: 'search-1',
        state: 'output-available',
        input: { query: 'sim' },
        output: {
          results: [
            {
              name: 'Pendaftaran SIM Baru',
              href: '/layanan/sim-baru',
              sourceUrl: 'https://korlantas.polri.go.id/',
            },
          ],
        },
      },
    ],
  };

  it('shows nothing while a reply has only tool results and no text yet', () => {
    const { container } = render(
      <AssistantMessage
        isApprovalReady={false}
        isStreaming
        message={lookupMessage}
        onApproval={() => undefined}
        onNavigate={() => undefined}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('holds links and sources back until the reply has finished streaming', () => {
    const message: UIMessage = {
      ...lookupMessage,
      parts: [{ type: 'text', text: 'Langkah pertama.' }, ...lookupMessage.parts],
    };
    const props = {
      isApprovalReady: false,
      message,
      onApproval: () => undefined,
      onNavigate: () => undefined,
    };
    const { rerender } = render(<AssistantMessage {...props} isStreaming />);

    expect(screen.getByText('Langkah pertama.')).toBeTruthy();
    expect(screen.queryByText('Buka di HAKKITA')).toBeNull();
    expect(screen.queryByText('Sumber resmi')).toBeNull();

    rerender(<AssistantMessage {...props} isStreaming={false} />);

    expect(screen.getByText('Buka di HAKKITA')).toBeTruthy();
    expect(screen.getByText('Sumber resmi')).toBeTruthy();
  });
});
