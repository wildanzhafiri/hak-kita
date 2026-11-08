import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AssistantText } from './assistant-text';

describe('AssistantText', () => {
  it('formats a sourced answer as readable list items without raw emphasis markers', () => {
    render(<AssistantText text="Siapkan berkas berikut: 1. **Email aktif** untuk akun. 2. Periksa panduan resmi." />);

    expect(screen.getByText('Email aktif').tagName).toBe('STRONG');
    expect(screen.queryByText(/\*\*/)).toBeNull();
    expect(screen.getByText('1.')).toBeTruthy();
    expect(screen.getByText('2.')).toBeTruthy();
  });
});
