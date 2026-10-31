import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { berkasPath } from '@hakkita/domain';
import type { RencanaSuggestionsProps } from './types';

export function RencanaSuggestions({ programs, heading }: RencanaSuggestionsProps) {
  return (
    <section>
      <h2 className="plan-heading">{heading}</h2>
      <ul className="suggest-list">
        {programs.map((program) => (
          <li key={program.id}>
            <Link href={berkasPath(program)}>
              <span>
                <strong>{program.nama}</strong>
                <small>{program.kategori}</small>
              </span>
              <span className="text-link">
                Siapkan berkas <ArrowRight size={17} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
