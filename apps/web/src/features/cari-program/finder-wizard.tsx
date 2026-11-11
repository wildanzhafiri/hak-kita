'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PreferensiProfil } from '@hakkita/schema';
import { Button } from '@/components/ui/button';
import { ACTIVITY_OPTIONS, EDUCATION_OPTIONS, INTEREST_OPTIONS } from '@/features/profil/constants';
import { FINDER_STEP_IDS } from './constants';
import { FINDER_COPY as COPY, FINDER_STEP_COPY, FINDER_STEP_LEGENDS } from './content';
import { canAdvance, toggleItem } from './finder-state';
import { FinderOptions } from './finder-options';
import { FinderRegionStep } from './finder-region-step';
import type { FinderWizardProps } from './types';

const STEP_TOTAL = FINDER_STEP_IDS.length;

export function FinderWizard({
  state,
  regions,
  regionsFailed,
  onChange,
  onClose,
}: FinderWizardProps) {
  const { answers, step } = state;
  const stepId = FINDER_STEP_IDS[step] ?? FINDER_STEP_IDS[0];
  const copy = FINDER_STEP_COPY[stepId];
  const isLast = step === STEP_TOTAL - 1;
  const isBlocked = !canAdvance(step, answers);
  const position = step + 1;
  const percent = Math.round((position / STEP_TOTAL) * 100);

  function patch(changes: Partial<PreferensiProfil>) {
    onChange({ answers: { ...answers, ...changes } });
  }

  function goNext() {
    if (isBlocked) return;
    onChange(isLast ? { showResults: true } : { step: step + 1 });
  }

  return (
    <section
      aria-labelledby="finder-question-heading"
      className="mx-auto mt-[30px] w-full max-w-[744px] max-[767px]:mt-6"
    >
      <div className="flex justify-between gap-4 text-[13px] font-semibold text-[#64748b]">
        <span>
          {COPY.progressLabel} {position} {COPY.progressOf} {STEP_TOTAL}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        aria-label={`${COPY.progressLabel} ${position} ${COPY.progressOf} ${STEP_TOTAL}`}
        aria-valuemax={STEP_TOTAL}
        aria-valuemin={1}
        aria-valuenow={position}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#e7ecf2]"
        role="progressbar"
      >
        <span
          className="block h-full rounded-[inherit] bg-[#1769c2] transition-[width] duration-[180ms] ease-in-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mb-5 mt-[26px] max-[767px]:mt-[22px]">
        <h2
          className="m-0 mt-2 text-2xl font-semibold leading-[1.35] text-[#253044] max-[767px]:text-[21px]"
          id="finder-question-heading"
        >
          {copy.title}
        </h2>
        <p className="m-0 mt-[7px] text-[15px] leading-[1.55] text-[#475569] max-[767px]:text-sm">
          {copy.description}
        </p>
      </div>

      {stepId === 'minat' && (
        <FinderOptions
          isMultiple
          legend={FINDER_STEP_LEGENDS.minat}
          name="minat"
          onToggle={(value) =>
            patch({ minat: toggleItem(answers.minat, value as PreferensiProfil['minat'][number]) })
          }
          options={INTEREST_OPTIONS}
          values={answers.minat}
        />
      )}
      {stepId === 'kegiatan' && (
        <FinderOptions
          isMultiple
          legend={FINDER_STEP_LEGENDS.kegiatan}
          name="kegiatan"
          onToggle={(value) =>
            patch({
              kegiatan: toggleItem(answers.kegiatan, value as PreferensiProfil['kegiatan'][number]),
            })
          }
          options={ACTIVITY_OPTIONS}
          values={answers.kegiatan}
        />
      )}
      {stepId === 'wilayah' && (
        <>
          <FinderRegionStep
            kota={answers.kota}
            onChange={(provinsi, kota) => patch({ provinsi, kota })}
            provinsi={answers.provinsi}
            regions={regions}
          />
          {regionsFailed && (
            <p className="m-0 mt-3 text-sm text-[#a13239]" role="alert">
              {COPY.regionsError}
            </p>
          )}
        </>
      )}
      {stepId === 'pendidikan' && (
        <FinderOptions
          isMultiple={false}
          legend={FINDER_STEP_LEGENDS.pendidikan}
          name="pendidikan"
          onToggle={(value) => patch({ pendidikan: value as PreferensiProfil['pendidikan'] })}
          options={EDUCATION_OPTIONS}
          values={answers.pendidikan ? [answers.pendidikan] : []}
        />
      )}

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#e7ecf2] pt-[18px] max-[767px]:mt-6 max-[767px]:flex-wrap max-[767px]:gap-2">
        {step === 0 ? (
          <Button
            className="max-[767px]:px-3 max-[767px]:text-[13px]"
            onPress={onClose}
            tone="secondary"
          >
            {COPY.close}
          </Button>
        ) : (
          <Button
            className="max-[767px]:px-3 max-[767px]:text-[13px]"
            onPress={() => onChange({ step: step - 1 })}
            tone="secondary"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            {COPY.back}
          </Button>
        )}
        <div className="flex items-center justify-end gap-3 max-[767px]:ml-auto max-[767px]:flex-wrap max-[767px]:gap-1">
          {step > 0 && (
            <button
              className="min-h-11 cursor-pointer border-0 bg-transparent px-3 text-sm text-[#475569] hover:text-[#1769c2] hover:underline hover:underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2] max-[767px]:px-2"
              onClick={goNext}
              type="button"
            >
              {COPY.skip}
            </button>
          )}
          <Button
            className="max-[767px]:px-3 max-[767px]:text-[13px]"
            isDisabled={isBlocked}
            onPress={goNext}
          >
            {isLast ? COPY.showResults : COPY.next}
            <ArrowRight aria-hidden="true" size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
}
