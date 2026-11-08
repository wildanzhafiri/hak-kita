import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { makeProgram } from '@/test/fixtures';
import { StartGuideButton } from './start-guide-button';

describe('StartGuideButton', () => {
  it('starts local step guidance without requiring an account', () => {
    render(<StartGuideButton program={makeProgram({ id: 'contoh' })} />);
    const link = screen.getByRole('link', { name: /Mulai panduan di Rencanaku/ });
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link);
    expect(window.localStorage.getItem(`${STEP_PROGRESS_STORAGE_PREFIX}contoh`)).toBe(
      '{"completed":[],"stuck":null}',
    );
  });
});
