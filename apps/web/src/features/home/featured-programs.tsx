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
    <section className="bg-white pb-[7px] pt-8 max-[640px]:py-8">
      <div className="container">
        <div className="mb-[30px] flex items-end justify-between gap-6 max-[640px]:mb-[26px] max-[640px]:flex-wrap">
          <div>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.035em]">
              {isPersonal ? PERSONAL_COPY.personalHeading : PERSONAL_COPY.generalHeading}
            </h2>
            <p className="mt-2.5 text-[15px] text-[#687385]">
              {isLoadingProfile ? DEFAULT_DESCRIPTION : <HomePersonalization mode={mode} />}
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[#196dcc]"
            href="/kenali-hakmu"
          >
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
