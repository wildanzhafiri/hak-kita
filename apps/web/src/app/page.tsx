import { isLayanan } from '@hakkita/domain';
import { FEATURED_PROGRAM_COUNT } from '@/features/home/content';
import { FeaturedPrograms } from '@/features/home/featured-programs';
import { HomeFaq } from '@/features/home/home-faq';
import { HomepageIntroduction } from '@/features/home/homepage-introduction';
import { HomepageServices } from '@/features/home/homepage-services';
import { HeroSection } from '@/features/home/hero-section';
import { ProgramCategories } from '@/features/home/program-categories';
import { TransparencyPreview } from '@/features/home/transparency-preview';
import { loadPrograms } from '@/server/data';

export default async function HomePage() {
  const programs = await loadPrograms();
  const featured = programs.filter((p) => !isLayanan(p)).slice(0, FEATURED_PROGRAM_COUNT);

  return (
    <>
      <HeroSection programs={programs} />
      <HomepageIntroduction />
      <ProgramCategories />
      <FeaturedPrograms programs={featured} />
      <HomepageServices programs={programs} />
      <TransparencyPreview />
      <HomeFaq />
    </>
  );
}
