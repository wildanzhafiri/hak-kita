'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Profile } from '@hakkita/schema';
import { Button } from '@/components/ui/button';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { useToday } from '@/hooks/use-today';
import { AGE_OPTIONS, GRADUATION_OPTIONS, GROUP_OPTIONS, QUESTIONS } from './content';
import { OTHER_REGION } from './constants';
import { ConditionQuestion } from './condition-question';
import { MatchResults } from './match-results';
import type { ConditionCheckerProps, ConditionOption, QuestionKey } from './types';
import { useConditionProfile } from './use-condition-profile';

function answerValue(profile: Profile, key: QuestionKey): string | null {
  const answer = profile[key];
  return answer === null ? null : String(answer);
}

export function ConditionChecker({ programs, wilayah, builtOn }: ConditionCheckerProps) {
  const { profile, update, reset } = useConditionProfile();
  const [step, setStep] = useState(0);
  const today = useToday(builtOn);
  const questions = profile.kelompok === 'calon-mahasiswa' ? QUESTIONS : QUESTIONS.slice(0, 3);
  const question = questions[step];

  function optionsFor(key: QuestionKey): ConditionOption[] {
    if (key === 'kelompok') return GROUP_OPTIONS;
    if (key === 'rentangUsia') return AGE_OPTIONS;
    if (key === 'tahunLulus') return GRADUATION_OPTIONS;
    return [
      ...wilayah
        .filter((area) => area.level === 'provinsi')
        .map((area) => ({ value: area.kode, label: area.nama })),
      { value: OTHER_REGION, label: 'Wilayah lain atau belum ada di daftar' },
    ];
  }

  function selectAnswer(key: QuestionKey, value: string) {
    if (key === 'kelompok') {
      const group = GROUP_OPTIONS.find((option) => option.value === value);
      if (group) update({ kelompok: group.value, tahunLulus: null });
    } else if (key === 'rentangUsia') {
      const age = AGE_OPTIONS.find((option) => option.value === value);
      if (age) update({ rentangUsia: age.value });
    } else if (key === 'wilayah') {
      update({ wilayah: value });
    } else {
      update({ tahunLulus: value === 'lain' ? 'lain' : Number(value) });
    }
  }

  function startOver() {
    reset();
    setStep(0);
  }

  if (!question) {
    return (
      <MatchResults
        programs={programs}
        wilayah={wilayah}
        profile={profile}
        today={today}
        onEdit={() => setStep(0)}
        onReset={startOver}
      />
    );
  }

  const selected = answerValue(profile, question.key);
  return (
    <div className="condition-layout">
      <aside className="condition-side panel mint">
        <ShieldCheck size={30} />
        <h2>Kenali pilihanmu.</h2>
        <p>Jawab beberapa pertanyaan tanpa NIK atau dokumen pribadi.</p>
        <ol>
          {questions.map((entry, index) => (
            <li key={entry.key} className={index === step ? 'active' : undefined}>
              <span>{index + 1}</span>
              {entry.title}
            </li>
          ))}
        </ol>
        <small>Jawaban tersimpan di perangkat ini dan dapat kamu hapus kapan saja.</small>
      </aside>
      <div className="condition-form panel">
        <ProgressMeter
          value={step}
          max={questions.length}
          summary={`Pertanyaan ${step + 1} dari ${questions.length}`}
          label="Progres pertanyaan"
        />
        <ConditionQuestion
          title={question.title}
          description={question.description}
          value={selected}
          options={optionsFor(question.key)}
          onSelect={(value) => selectAnswer(question.key, value)}
        />
        <div className="condition-actions">
          <Button
            tone="secondary"
            type="button"
            isDisabled={step === 0}
            onPress={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
          <Button
            type="button"
            isDisabled={selected === null}
            onPress={() => setStep(step + 1)}
          >
            {step === questions.length - 1 ? 'Lihat hasil' : 'Lanjut'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
