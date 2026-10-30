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
            <label>
              <input
                type="checkbox"
                checked={checked.includes(item.id)}
                onChange={() => onToggle(item.id)}
              />
              <span>
                <strong>{item.label}</strong>
                {item.catatan && <small>{item.catatan}</small>}
              </span>
            </label>
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
