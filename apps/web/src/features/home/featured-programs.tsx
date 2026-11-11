'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { profileCompleteness } from '@hakkita/domain';
import { ProgramSchema } from '@hakkita/schema';
import type { Program } from '@hakkita/schema';
import { ProgramGrid } from '@/components/program/program-grid';
import { useAuth } from '@/hooks/use-auth';
import { HOME_PERSONALIZATION_COPY as PERSONAL_COPY } from '@/features/profil/content';
import { useProfile } from '@/features/profil/use-profile';
import {
  HOME_CONTAINER_CLASSES,
  HOME_HEADING_CLASSES,
  HOME_SECTION_LINK_CLASSES,
} from './constants';
import { HomePersonalization } from './home-personalization';
import type { FeaturedProgramsProps, PersonalPicks } from './types';

const DEFAULT_DESCRIPTION = 'Jelajahi berbagai program bantuan dan kesempatan yang tersedia.';

async function fetchPersonalPrograms(): Promise<Program[]> {
  const response = await fetch('/api/rekomendasi');
  if (!response.ok) return [];
  const body: unknown = await response.json();
  const programs =
    body && typeof body === 'object' && 'programs' in body ? body.programs : undefined;
  const parsed = ProgramSchema.array().safeParse(programs);
  return parsed.success ? parsed.data : [];
}

export function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const { user, isReady } = useAuth();
  const { status, preferensi } = useProfile();
  const [picks, setPicks] = useState<PersonalPicks | null>(null);
  const userId = user?.id ?? null;
  const isLoadingProfile = !isReady || (userId !== null && status === 'loading');
  const completeness = profileCompleteness(preferensi);
  const mode = !userId ? 'guest' : completeness === 'cukup' ? 'ready' : 'incomplete';

  useEffect(() => {
    if (!userId || status !== 'ready' || completeness !== 'cukup') return;
    let isActive = true;
    fetchPersonalPrograms()
      .then((personal) => {
        if (isActive) setPicks({ userId, preferensi, programs: personal });
      })
      .catch(() => undefined);
    return () => {
      isActive = false;
    };
  }, [userId, status, completeness, preferensi]);

  const personal =
    mode === 'ready' && picks?.userId === userId && picks.preferensi === preferensi
      ? picks.programs
      : [];
  const isPersonal = personal.length > 0;

  return (
    <section className="bg-white pb-20 pt-8 max-[900px]:pb-16 max-[767px]:pt-7 max-[640px]:pb-[50px]">
      <div className={HOME_CONTAINER_CLASSES}>
        <div className="mb-[30px] flex items-start justify-between gap-6 max-[640px]:mb-[26px] max-[640px]:flex-wrap max-[640px]:gap-4">
          <div>
            <h2 className={HOME_HEADING_CLASSES}>
              {isPersonal ? PERSONAL_COPY.personalHeading : PERSONAL_COPY.generalHeading}
            </h2>
            <p className="mt-2.5 text-[13px] leading-[1.9] text-[#758292] max-[640px]:text-xs">
              {isLoadingProfile ? DEFAULT_DESCRIPTION : <HomePersonalization mode={mode} />}
            </p>
          </div>
          <Link className={HOME_SECTION_LINK_CLASSES} href="/kenali-hakmu">
            Lihat semua program <ArrowRight size={19} />
          </Link>
        </div>
        <ProgramGrid
          key={isPersonal ? 'personal' : 'general'}
          programs={isPersonal ? personal : programs}
          horizontal
        />
      </div>
    </section>
  );
}
