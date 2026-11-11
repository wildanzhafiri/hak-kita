import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarEmailPreview } from './radar-email-preview';

afterEach(() => vi.unstubAllGlobals());

describe('RadarEmailPreview', () => {
  it('requires a final confirmation before sending the previewed email', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          subject: 'Kabar KIP Kuliah',
          text: 'Isi email',
          html: '<html><body>Isi email</body></html>',
          eligibleCount: 3,
        }),
      )
      .mockResolvedValueOnce(Response.json({ sent: 3, failed: 0 }));
    vi.stubGlobal('fetch', fetchMock);

    render(<RadarEmailPreview newsId="21760e42-32e7-4ee1-9e95-d32ae0af6601" onDismiss={vi.fn()} />);

    const send = await screen.findByRole('button', { name: 'Kirim sekarang' });
    expect(send.hasAttribute('disabled')).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(send);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body)).toEqual({
      newsId: '21760e42-32e7-4ee1-9e95-d32ae0af6601',
    });
    expect((await screen.findByRole('status')).textContent).toContain('3 email terkirim');
  });
});
