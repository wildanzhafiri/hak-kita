import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { KATEGORI_IMAGE } from './constants';
import { SaveButton } from './save-button';
import type { ProgramCardProps } from './types';

export function ProgramCard({ program }: ProgramCardProps) {
  const href = programPath(program);
  return (
    <article className="program-card">
      <div className="program-card-image">
        <Image src={KATEGORI_IMAGE[program.kategori]} alt="" width={600} height={300} />
      </div>
      <div className="program-card-body">
        <div className="card-top">
          <span className="category">{program.kategori}</span>
        </div>
        <h3>
          <Link href={href}>{program.nama}</Link>
        </h3>
        <p>{program.ringkasan}</p>
        <div className="card-foot">
          <Link className="text-link" href={href}>
            Lihat Program <ArrowRight size={17} />
          </Link>
          <SaveButton program={program} />
        </div>
      </div>
    </article>
  );
}
