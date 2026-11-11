import { FEATURED_PROGRAM_COUNT, FEATURED_SERVICE_COUNT } from '@/features/home/content';
import { FeaturedPrograms } from '@/features/home/featured-programs';
import { HomeFaq } from '@/features/home/home-faq';
import { HomepageIntroduction } from '@/features/home/homepage-introduction';
import { HomepageServices } from '@/features/home/homepage-services';
import { HeroSection } from '@/features/home/hero-section';
import { ProgramCategories } from '@/features/home/program-categories';
import { ProgramFinderPromo } from '@/features/home/program-finder-promo';
import { TransparencyPreview } from '@/features/home/transparency-preview';
import { loadPrograms, loadPublicServices } from '@/server/data';

export default async function HomePage() {
  const [programs, services] = await Promise.all([loadPrograms(), loadPublicServices()]);
  const featured = programs.slice(0, FEATURED_PROGRAM_COUNT);
  const featuredServices = services.slice(0, FEATURED_SERVICE_COUNT);

  return (
    <>
      <HeroSection programs={[...programs, ...services]} />
      <HomepageIntroduction />
      <ProgramCategories />
      <ProgramFinderPromo />
      <FeaturedPrograms programs={featured} />
      <HomepageServices services={featuredServices} />
      <TransparencyPreview />
      <HomeFaq />
    </>
  );
}
