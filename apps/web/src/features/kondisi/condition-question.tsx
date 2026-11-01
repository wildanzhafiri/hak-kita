import { ChoiceGroup } from '@/components/ui/choice-group';
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
      <ChoiceGroup name="condition-answer" value={value} options={options} onChange={onSelect} />
    </fieldset>
  );
}
