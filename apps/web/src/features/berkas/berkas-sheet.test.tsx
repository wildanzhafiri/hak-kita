import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BERKAS, BUILT_ON, makeProgram } from '@/test/fixtures';
import { BerkasSheet } from './berkas-sheet';

function renderSheet() {
  return render(
    <BerkasSheet
      program={makeProgram({ id: 'kip-kuliah', nama: 'KIP Kuliah', berkas: BERKAS })}
      berkas={BERKAS}
      builtOn={BUILT_ON}
    />,
  );
}

describe('BerkasSheet', () => {
  it('shows only unconditional documents before any answer', () => {
    renderSheet();
    expect(screen.getByText('Alamat email aktif')).toBeTruthy();
    expect(screen.queryByText('Surat Keterangan Tidak Mampu')).toBeNull();
    expect(screen.getByText(/Jawab pertanyaan di atas/)).toBeTruthy();
  });

  it('adds a conditional document when the matching answer is chosen', () => {
    renderSheet();
    fireEvent.click(screen.getByLabelText('Penghasilan di bawah UMP'));
    expect(screen.getByText('Surat Keterangan Tidak Mampu')).toBeTruthy();
    expect(screen.queryByText(/Jawab pertanyaan di atas/)).toBeNull();
  });

  it('removes the conditional document and its check mark when the answer changes', () => {
    renderSheet();
    fireEvent.click(screen.getByLabelText('Penghasilan di bawah UMP'));
    fireEvent.click(screen.getByLabelText(/Surat Keterangan Tidak Mampu/));
    expect(screen.getByText('1 dari 2 dokumen siap')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Saya punya KIP'));
    expect(screen.queryByText('Surat Keterangan Tidak Mampu')).toBeNull();
    expect(screen.getByText('0 dari 1 dokumen siap')).toBeTruthy();
  });

  it('updates readiness as documents are checked', () => {
    renderSheet();
    expect(screen.getByText('0 dari 1 dokumen siap')).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/Alamat email aktif/));
    expect(screen.getByText('1 dari 1 dokumen siap')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
  });

  it('keeps progress on the device and restores it on the next visit', () => {
    const first = renderSheet();
    fireEvent.click(screen.getByLabelText(/Alamat email aktif/));
    first.unmount();
    renderSheet();
    expect(screen.getByText('1 dari 1 dokumen siap')).toBeTruthy();
  });

  it('clears the saved progress on reset', () => {
    renderSheet();
    fireEvent.click(screen.getByLabelText(/Alamat email aktif/));
    fireEvent.click(screen.getByRole('button', { name: /Hapus isian dari perangkat ini/ }));
    expect(screen.getByText('0 dari 1 dokumen siap')).toBeTruthy();
  });

  it('lists common problems with their next step', () => {
    renderSheet();
    expect(screen.getByText('NISN tidak dikenali')).toBeTruthy();
    expect(screen.getByText('Minta operator sekolah memperbaiki data.')).toBeTruthy();
  });

  it('stores the personal note', () => {
    renderSheet();
    fireEvent.change(screen.getByLabelText('Catatan untuk dirimu sendiri'), {
      target: { value: 'Tanya operator hari Senin' },
    });
    expect(
      (screen.getByLabelText('Catatan untuk dirimu sendiri') as HTMLTextAreaElement).value,
    ).toBe('Tanya operator hari Senin');
  });
});
