import { Checkbox } from '@/components/ui/checkbox';
import type { ProfileChoiceFieldsProps } from './types';

export function ProfileChoiceFields({
  heading,
  hint,
  legend,
  name,
  options,
  values,
  onToggle,
  children,
}: ProfileChoiceFieldsProps) {
  return (
    <section className="border-b border-[#e7ecf2] pb-8 last:border-b-0 last:pb-0">
      <h2 className="m-0 mb-2 text-xl font-semibold text-[#253044]">{heading}</h2>
      <p className="m-0 mb-5 text-sm leading-6 text-[#64748b]">{hint}</p>
      <fieldset className="m-0 grid min-w-0 gap-3 border-0 p-0 sm:grid-cols-2">
        <legend className="sr-only">{legend}</legend>
        {options.map((option) => {
          const isSelected = values.includes(option.value);
          return (
            <div
              className={`min-h-[46px] rounded-lg border px-3 py-2.5 max-[640px]:min-h-[52px] max-[640px]:py-3 transition-colors motion-reduce:transition-none ${isSelected ? 'border-[#9fc2ec] bg-[#edf5ff]' : 'border-[#e1e9f2] bg-white'}`}
              data-name={name}
              key={option.value}
            >
              <Checkbox isSelected={isSelected} onChange={() => onToggle(option.value)}>
                {option.label}
              </Checkbox>
            </div>
          );
        })}
      </fieldset>
      {children}
    </section>
  );
}
