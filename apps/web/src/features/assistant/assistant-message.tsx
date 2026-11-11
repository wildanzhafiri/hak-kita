'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookmarkCheck, BookmarkPlus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistantText } from './assistant-text';
import type { AssistantDestination, AssistantMessageProps, AssistantSource } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getToolSources(output: unknown): AssistantSource[] {
  if (!isRecord(output)) return [];
  const candidates = Array.isArray(output.results) ? output.results : [output];
  return candidates.flatMap((candidate) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.sourceUrl !== 'string' ||
      !candidate.sourceUrl.startsWith('https://')
    )
      return [];
    const label =
      typeof candidate.title === 'string'
        ? candidate.title
        : typeof candidate.name === 'string'
          ? candidate.name
          : typeof candidate.program === 'string'
            ? candidate.program
            : 'Sumber resmi';
    return [{ label, url: candidate.sourceUrl }];
  });
}

function getToolDestinations(output: unknown): AssistantDestination[] {
  if (!isRecord(output)) return [];
  const candidates = Array.isArray(output.results) ? output.results : [output];
  return candidates.flatMap((candidate) => {
    if (!isRecord(candidate) || typeof candidate.href !== 'string') return [];
    if (
      !/^\/(kenali-hakmu|program|layanan)\/[a-z0-9-]+$/.test(candidate.href) &&
      ![
        '/',
        '/kenali-hakmu',
        '/layanan',
        '/anggaran',
        '/rencanaku',
        '/periksa-kondisimu',
        '/bantuan',
      ].includes(candidate.href)
    )
      return [];
    const label = typeof candidate.name === 'string' ? candidate.name : candidate.label;
    if (typeof label !== 'string') return [];
    return [{ label, href: candidate.href }];
  });
}

function getApproval(part: unknown): { id: string; programId: string } | null {
  if (!isRecord(part) || part.type !== 'tool-saveProgramToPlan') return null;
  if (part.state !== 'approval-requested' || !isRecord(part.approval) || !isRecord(part.input))
    return null;
  if (typeof part.approval.id !== 'string' || typeof part.input.programId !== 'string') return null;
  return { id: part.approval.id, programId: part.input.programId };
}

export function AssistantMessage({
  message,
  onApproval,
  isApprovalReady,
  isStreaming = false,
  onNavigate,
}: AssistantMessageProps) {
  const isAssistant = message.role === 'assistant';
  const outputs = message.parts.flatMap((part) => {
    const candidate: unknown = part;
    return isRecord(candidate) && candidate.state === 'output-available' ? [candidate.output] : [];
  });
  const sources = [
    ...new Map(outputs.flatMap(getToolSources).map((source) => [source.url, source])).values(),
  ].slice(0, 4);
  const destinations = [
    ...new Map(
      outputs.flatMap(getToolDestinations).map((destination) => [destination.href, destination]),
    ).values(),
  ].slice(0, 3);

  const hasVisibleContent = message.parts.some(
    (part) =>
      (part.type === 'text' && part.text.trim() !== '') ||
      getApproval(part) !== null ||
      (part.type === 'tool-saveProgramToPlan' && part.state === 'output-available'),
  );
  if (isAssistant && isStreaming && !hasVisibleContent) return null;
  const showReferences = !isStreaming;

  return (
    <article
      className={`flex motion-safe:animate-[assistant-reveal_260ms_ease-out_both] ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={
          isAssistant
            ? 'min-w-0 max-w-[94%] rounded-2xl rounded-tl-md border border-[#e8eef5] bg-white px-4 py-3'
            : 'min-w-0 max-w-[86%] rounded-2xl rounded-br-md border border-[#deebfb] bg-[#edf5ff] px-4 py-3 text-sm leading-6 text-[#1b304c]'
        }
      >
        <div className="space-y-3">
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return isAssistant ? (
                <AssistantText key={`${message.id}-${index}`} text={part.text} />
              ) : (
                <p
                  className="whitespace-pre-wrap break-words text-[#1b304c]"
                  key={`${message.id}-${index}`}
                >
                  {part.text}
                </p>
              );
            }

            const approval = getApproval(part);
            if (approval) {
              return (
                <div
                  className="rounded-xl border border-[#bcd7f5] bg-[#f3f8ff] p-3.5"
                  key={approval.id}
                >
                  <div className="flex items-start gap-2.5 text-sm text-[#25354b]">
                    <BookmarkPlus
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[#196dcc]"
                      size={18}
                    />
                    <p>Simpan program ini ke Rencanaku?</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      className="min-h-9 px-3 text-xs"
                      isDisabled={!isApprovalReady}
                      onPress={() => onApproval(approval.id, true)}
                    >
                      <Check aria-hidden="true" size={15} /> Simpan program
                    </Button>
                    <Button
                      className="min-h-9 px-3 text-xs"
                      isDisabled={!isApprovalReady}
                      onPress={() => onApproval(approval.id, false)}
                      tone="secondary"
                    >
                      <X aria-hidden="true" size={15} /> Batal
                    </Button>
                  </div>
                </div>
              );
            }

            if (
              part.type === 'tool-saveProgramToPlan' &&
              part.state === 'output-available' &&
              isRecord(part.output)
            ) {
              return (
                <p
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${part.output.saved === true ? 'bg-[#edf8f2] text-[#256947]' : 'bg-[#fff4f2] text-[#a33b35]'}`}
                  key={`${message.id}-${index}`}
                >
                  <BookmarkCheck aria-hidden="true" size={17} />
                  {part.output.saved === true
                    ? `${String(part.output.programName)} tersimpan di Rencanaku.`
                    : String(part.output.reason ?? 'Program belum berhasil disimpan.')}
                </p>
              );
            }

            return null;
          })}
          {showReferences && destinations.length > 0 && (
            <div className="border-t border-[#e8edf2] pt-3">
              <p className="mb-2 text-xs font-semibold text-[#617087]">Buka di HAKKITA</p>
              <div className="grid gap-1.5">
                {destinations.map((destination) => (
                  <Link
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#f3f8ff] px-3 py-2 text-sm font-medium text-[#196dcc] hover:bg-[#e6f1fd]"
                    href={destination.href}
                    key={destination.href}
                    onClick={onNavigate}
                  >
                    <span className="min-w-0 [overflow-wrap:anywhere]">{destination.label}</span>
                    <ArrowRight aria-hidden="true" className="shrink-0" size={16} />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {showReferences && sources.length > 0 && (
            <div className="border-t border-[#e8edf2] pt-3">
              <p className="mb-1.5 text-xs font-semibold text-[#617087]">Sumber resmi</p>
              <ul className="grid min-w-0 gap-1.5">
                {sources.map((source) => (
                  <li className="min-w-0" key={source.url}>
                    <a
                      className="inline-flex max-w-full items-start gap-1 text-xs font-medium leading-5 text-[#196dcc] underline decoration-[#c7dbf2] underline-offset-2 hover:decoration-[#196dcc]"
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="min-w-0 [overflow-wrap:anywhere]">{source.label}</span>
                      <ArrowUpRight aria-hidden="true" className="mt-0.5 shrink-0" size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
