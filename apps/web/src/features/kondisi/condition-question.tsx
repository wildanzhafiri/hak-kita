import type { ConditionQuestionProps } from './types';

export function ConditionQuestion({
  title,
  description,
  value,
  options,
  onSelect,
}: ConditionQuestionProps) {
  return (
    <fieldset className="condition-question">
      <legend>{title}</legend>
      <p>{description}</p>
      <div className="condition-options">
        {options.map((option) => (
          <label key={option.value} className={value === option.value ? 'selected' : undefined}>
            <input
              type="radio"
              name="condition-answer"
              value={option.value}
              checked={value === option.value}
              onChange={() => onSelect(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
