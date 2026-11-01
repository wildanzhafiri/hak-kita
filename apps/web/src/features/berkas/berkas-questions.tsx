import { ChoiceGroup } from '@/components/ui/choice-group';
import type { BerkasQuestionsProps } from './types';

export function BerkasQuestions({ questions, answers, onAnswer }: BerkasQuestionsProps) {
  return (
    <>
      {questions.map((question) => (
        <fieldset key={question.id} className="question">
          <legend>{question.teks}</legend>
          <ChoiceGroup
            name={question.id}
            value={answers[question.id] ?? null}
            options={question.pilihan.map((choice) => ({
              value: choice.nilai,
              label: choice.label,
            }))}
            layout="pills"
            onChange={(value) => onAnswer(question.id, value)}
          />
        </fieldset>
      ))}
    </>
  );
}
