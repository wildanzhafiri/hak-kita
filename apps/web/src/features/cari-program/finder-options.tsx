import { Check } from 'lucide-react';
import { FINDER_OPTION_CLASSES } from './constants';
import type { FinderOptionsProps } from './types';

export function FinderOptions({
  legend,
  name,
  options,
  values,
  isMultiple,
  onToggle,
}: FinderOptionsProps) {
  return (
    <fieldset className="m-0 grid min-w-0 grid-cols-2 gap-3! border-0 p-0 max-[767px]:grid-cols-1">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label className={`group ${FINDER_OPTION_CLASSES}`} key={option.value}>
          <input
            checked={values.includes(option.value)}
            className="sr-only"
            name={name}
            onChange={() => onToggle(option.value)}
            type={isMultiple ? 'checkbox' : 'radio'}
            value={option.value}
          />
          <span
            aria-hidden="true"
            className={`grid size-[18px] shrink-0 place-items-center border-[1.5px] border-[#94a3b8] bg-white text-white group-has-[:checked]:border-[#1769c2] group-has-[:checked]:bg-[#1769c2] ${isMultiple ? 'rounded-[5px]' : 'rounded-full group-has-[:checked]:shadow-[inset_0_0_0_4px_#fff]'}`}
          >
            {isMultiple && (
              <Check
                className="opacity-0 group-has-[:checked]:opacity-100"
                size={12}
                strokeWidth={3}
              />
            )}
          </span>
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
