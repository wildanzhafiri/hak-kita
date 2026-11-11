'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { ProgramSchema, type Program } from '@hakkita/schema';
import { ADMIN_DEFAULT_CATEGORY_BY_KIND } from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import type {
  ProgramEditorDraft,
  ProgramEditorProps,
  ProgramEditorTextField,
  ProgramRequirementDraft,
  ProgramSourceDraft,
  UseProgramEditorResult,
} from './types';

function createDraft(program?: Program): ProgramEditorDraft {
  return {
    id: program?.id ?? '',
    kind: program?.jenis ?? 'program',
    name: program?.nama ?? '',
    category: program?.kategori ?? ADMIN_DEFAULT_CATEGORY_BY_KIND[program?.jenis ?? 'program'],
    organizer: program?.penyelenggara ?? '',
    summary: program?.ringkasan ?? '',
    about: program?.tentang ?? '',
    cost: program?.biaya ?? '',
    audience: program?.untuk.join('\n') ?? '',
    coverageLevel: program?.cakupan.level ?? 'nasional',
    coverageCode: program?.cakupan.kode ?? 'ID',
    gateType: program?.tipeGerbang ?? 'kategori',
    requirements: program?.syarat.map((requirement) => ({
      text: requirement.teks,
      sourceUrl: requirement.sumberUrl ?? '',
      quote: requirement.kutipan ?? '',
    })) ?? [{ text: '', sourceUrl: '', quote: '' }],
    steps: program?.langkah.join('\n') ?? '',
    documents: program?.dokumen.join('\n') ?? '',
    sourceUrl: program?.sumberUtama.url ?? '',
    sourceType: program?.sumberUtama.jenis ?? 'situs-resmi',
    sourceQuote: program?.sumberUtama.kutipan ?? '',
    additionalSources:
      program?.sumberTambahan.map((source) => ({
        url: source.url,
        type: source.jenis,
        quote: source.kutipan ?? '',
      })) ?? [],
    periodType: !program?.periode
      ? 'none'
      : program.periode === 'sepanjang-tahun'
        ? 'year-round'
        : 'date-range',
    periodOpen: typeof program?.periode === 'object' ? program.periode.buka : '',
    periodClose: typeof program?.periode === 'object' ? program.periode.tutup : '',
    verification: program?.verifikasi ?? 'belum',
    checkedAt: program?.tanggalDiperiksa ?? '',
  };
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function readErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object' || !('error' in payload)) return null;
  return typeof payload.error === 'string' ? payload.error : null;
}

export function useProgramEditor(
  program: Program | undefined,
  onCancel: ProgramEditorProps['onCancel'],
  onSave?: ProgramEditorProps['onSave'],
  onSaved?: ProgramEditorProps['onSaved'],
): UseProgramEditorResult {
  const router = useRouter();
  const [draft, setDraft] = useState(() => createDraft(program));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFieldChange(field: ProgramEditorTextField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleRequirementChange(
    index: number,
    field: keyof ProgramRequirementDraft,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      requirements: current.requirements.map((requirement, rowIndex) =>
        rowIndex === index ? { ...requirement, [field]: value } : requirement,
      ),
    }));
  }

  function handleAddRequirement() {
    setDraft((current) => ({
      ...current,
      requirements: [...current.requirements, { text: '', sourceUrl: '', quote: '' }],
    }));
  }

  function handleRemoveRequirement(index: number) {
    setDraft((current) => ({
      ...current,
      requirements: current.requirements.filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  function handleSourceChange(index: number, field: keyof ProgramSourceDraft, value: string) {
    setDraft((current) => ({
      ...current,
      additionalSources: current.additionalSources.map((source, sourceIndex) =>
        sourceIndex === index ? { ...source, [field]: value } : source,
      ),
    }));
  }

  function handleAddSource() {
    setDraft((current) => ({
      ...current,
      additionalSources: [
        ...current.additionalSources,
        { url: '', type: 'situs-resmi', quote: '' },
      ],
    }));
  }

  function handleRemoveSource(index: number) {
    setDraft((current) => ({
      ...current,
      additionalSources: current.additionalSources.filter(
        (_, sourceIndex) => sourceIndex !== index,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setErrorMessage(null);

    const requirements = draft.requirements
      .filter((requirement) => requirement.text.trim())
      .map((requirement) => ({
        teks: requirement.text.trim(),
        ...(requirement.sourceUrl.trim() ? { sumberUrl: requirement.sourceUrl.trim() } : {}),
        ...(requirement.quote.trim() ? { kutipan: requirement.quote.trim() } : {}),
      }));

    const candidate: unknown = {
      ...(program ?? {}),
      id: draft.id.trim(),
      nama: draft.name.trim(),
      jenis: draft.kind,
      kategori: draft.category,
      penyelenggara: draft.organizer.trim(),
      ringkasan: draft.summary.trim(),
      tentang: draft.about.trim() || undefined,
      biaya: draft.cost.trim() || undefined,
      untuk: splitLines(draft.audience),
      cakupan: { level: draft.coverageLevel, kode: draft.coverageCode.trim() },
      tipeGerbang: draft.gateType,
      syarat: requirements,
      langkah: splitLines(draft.steps),
      dokumen: splitLines(draft.documents),
      sumberUtama: {
        url: draft.sourceUrl.trim(),
        jenis: draft.sourceType,
        ...(program?.sumberUtama.dasarHukum ? { dasarHukum: program.sumberUtama.dasarHukum } : {}),
        ...(draft.sourceQuote.trim() ? { kutipan: draft.sourceQuote.trim() } : {}),
      },
      sumberTambahan: draft.additionalSources
        .filter((source) => source.url.trim())
        .map((source) => ({
          url: source.url.trim(),
          jenis: source.type,
          ...(source.quote.trim() ? { kutipan: source.quote.trim() } : {}),
        })),
      verifikasi: draft.verification,
      tanggalDiperiksa: draft.verification === 'belum' ? undefined : draft.checkedAt,
      ...(draft.periodType === 'year-round'
        ? { periode: 'sepanjang-tahun' }
        : draft.periodType === 'date-range'
          ? { periode: { buka: draft.periodOpen, tutup: draft.periodClose } }
          : { periode: undefined }),
    };
    const parsed = ProgramSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrorMessage(PROGRAM_DETAIL_COPY.invalidData);
      return;
    }

    setIsSaving(true);
    if (onSave) {
      const message = await onSave(parsed.data);
      setIsSaving(false);
      if (message) setErrorMessage(message);
      else {
        onSaved?.();
        onCancel?.();
      }
      return;
    }
    try {
      const endpoint = program
        ? `/api/admin/programs/${encodeURIComponent(program.id)}`
        : '/api/admin/programs';
      const response = await fetch(endpoint, {
        method: program ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const responseBody: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setErrorMessage(readErrorMessage(responseBody) ?? PROGRAM_DETAIL_COPY.saveFailure);
        setIsSaving(false);
        return;
      }
      router.refresh();
      if (program && onCancel) {
        onSaved?.();
        onCancel();
      } else {
        router.replace(`/admin/informasi/${encodeURIComponent(parsed.data.id)}`);
      }
    } catch {
      setErrorMessage(PROGRAM_DETAIL_COPY.saveFailure);
      setIsSaving(false);
    }
  }

  return {
    draft,
    isSaving,
    errorMessage,
    handleFieldChange,
    handleRequirementChange,
    handleAddRequirement,
    handleRemoveRequirement,
    handleSourceChange,
    handleAddSource,
    handleRemoveSource,
    handleSubmit,
  };
}
