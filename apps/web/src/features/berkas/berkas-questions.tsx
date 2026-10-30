import type { BerkasQuestionsProps } from './types';

export function BerkasQuestions({ questions, answers, onAnswer }: BerkasQuestionsProps) {
  return (
    <>
      {questions.map((question) => (
        <fieldset key={question.id} className="question">
          <legend>{question.teks}</legend>
          <div className="radio-options">
            {question.pilihan.map((choice) => {
              const chosen = answers[question.id] === choice.nilai;
              return (
                <label key={choice.nilai} className={chosen ? 'chosen' : undefined}>
                  <input
                    type="radio"
                    name={question.id}
                    value={choice.nilai}
                    checked={chosen}
                    onChange={() => onAnswer(question.id, choice.nilai)}
                  />
                  {choice.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </>
  );
}
