import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { profileCompleteness } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { AccountGate } from '@/features/profil/account-gate';
import { ACCOUNT_GATE_COPY, RECOMMENDATION_COPY as COPY } from '@/features/profil/content';
import { RecommendationCard } from '@/features/profil/recommendation-card';
import { loadRecommendations } from '@/server/recommendations';
import { loadUserProfileServer } from '@/server/user-profile';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: COPY.title,
  robots: { index: false, follow: false },
};

export default async function RekomendasiPage() {
  const profile = await loadUserProfileServer();
  const breadcrumbs = [
    { label: COPY.catalogBreadcrumb, href: '/kenali-hakmu' },
    { label: COPY.title },
  ];

  if (profile.status === 'anonymous') {
    return (
      <PageShell breadcrumbs={breadcrumbs} description={COPY.description} title={COPY.title}>
        <AccountGate
          next="/kenali-hakmu/rekomendasi"
          title={ACCOUNT_GATE_COPY.recommendationTitle}
        />
      </PageShell>
    );
  }
  if (profile.status === 'error') {
    return (
      <PageShell breadcrumbs={breadcrumbs} description={COPY.description} title={COPY.title}>
        <p className="text-sm text-[#a13239]" role="alert">
          {COPY.loadError}
        </p>
      </PageShell>
    );
  }

  const completeness = profileCompleteness(profile.preferensi);
  const recommendations =
    completeness === 'kosong' ? [] : await loadRecommendations(profile.preferensi);
  const isEmptyProfile = completeness === 'kosong';

  return (
    <PageShell breadcrumbs={breadcrumbs} description={COPY.description} title={COPY.title}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#435570]">
          {COPY.completeness[completeness]}
        </span>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#196dcc] hover:underline"
          href="/profil/edit?dari=profil"
        >
          {COPY.updateProfile}
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
      <p className="mb-6 flex items-start gap-3 rounded-xl border border-[#cbdcf0] bg-[#f2f7ff] px-4 py-3 text-sm leading-6 text-[#435570]">
        <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#196dcc]" size={20} />
        {COPY.note}
      </p>
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-3 gap-5 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1">
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.program.id} recommendation={recommendation} />
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 rounded-2xl border border-[#e1e9f2] bg-[#f9fbfd] px-6 py-10 text-center">
          <h2 className="m-0 text-xl font-semibold text-[#253044]">
            {isEmptyProfile ? COPY.emptyProfileTitle : COPY.emptyMatchTitle}
          </h2>
          <p className="m-0 max-w-[46ch] text-sm leading-6 text-[#617087]">
            {isEmptyProfile ? COPY.emptyProfileDescription : COPY.emptyMatchDescription}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Link className="button" href="/profil/edit?dari=profil">
              {isEmptyProfile ? COPY.emptyProfileAction : COPY.emptyMatchAction}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link
              className="text-sm font-semibold text-[#196dcc] hover:underline"
              href="/kenali-hakmu"
            >
              {COPY.browse}
            </Link>
          </div>
        </div>
      )}
    </PageShell>
  );
}
