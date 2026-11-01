import { Checkbox } from '@heroui/react';
import { Check } from 'lucide-react';
import { UNANSWERED_HINT } from './constants';
import type { BerkasChecklistProps } from './types';

export function BerkasChecklist({
  dokumen,
  checked,
  hasUnanswered,
  onToggle,
}: BerkasChecklistProps) {
  return (
    <>
      <ul className="checklist">
        {dokumen.map((item) => (
          <li key={item.id} className="checklist-item">
            <Checkbox
              className="flex min-w-0 flex-1"
              isSelected={checked.includes(item.id)}
              onChange={() => onToggle(item.id)}
            >
              <Checkbox.Content className="flex min-w-0 items-start gap-3">
                <Checkbox.Control className="mt-0.5 grid size-5 shrink-0 place-items-center rounded border border-[#aeb8c4] text-white transition-colors data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#196dcc]">
                  <Checkbox.Indicator>
                    <Check aria-hidden="true" size={14} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
              <span>
                <strong>{item.label}</strong>
                {item.catatan && <small>{item.catatan}</small>}
              </span>
              </Checkbox.Content>
            </Checkbox>
            <a
              className="text-link source-link"
              href={item.sumberUrl}
              target="_blank"
              rel="noreferrer"
            >
              Lihat sumber
            </a>
          </li>
        ))}
      </ul>
      {hasUnanswered && <p className="small-note">{UNANSWERED_HINT}</p>}
    </>
  );
}
