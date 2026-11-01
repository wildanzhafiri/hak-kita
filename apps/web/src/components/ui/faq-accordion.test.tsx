import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FaqAccordion } from './faq-accordion';

describe('FaqAccordion', () => {
  it('opens one answer and closes it when selected again', () => {
    const { container } = render(
      <FaqAccordion
        items={[
          { question: 'Apa itu HAKKITA?', answer: 'Portal informasi publik.' },
          { question: 'Apakah HAKKITA situs pemerintah?', answer: 'Bukan.' },
        ]}
      />,
    );

    const firstQuestion = screen.getByRole('button', { name: 'Apa itu HAKKITA?' });
    fireEvent.click(firstQuestion);
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Portal informasi publik.')).toBeTruthy();

    fireEvent.click(firstQuestion);
    expect(firstQuestion.getAttribute('aria-expanded')).toBe('false');
    const answerId = firstQuestion.getAttribute('aria-controls');
    expect(container.querySelector(`[id="${answerId}"]`)?.getAttribute('aria-hidden')).toBe('true');
  });
});
