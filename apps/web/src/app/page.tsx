import { isLayanan, todayWIB } from '@hakkita/domain';
import { ClosingBanner } from '@/features/home/closing-banner';
import { FEATURED_PROGRAM_COUNT } from '@/features/home/content';
import { FeaturedPrograms } from '@/features/home/featured-programs';
import { HeroSection } from '@/features/home/hero-section';
import { HowItWorks } from '@/features/home/how-it-works';
import { SearchSection } from '@/features/home/search-section';
import { SectionsGrid } from '@/features/home/sections-grid';
import { TransparencyPreview } from '@/features/home/transparency-preview';
import { TrustSection } from '@/features/home/trust-section';
import { loadPrograms, loadWilayahFile } from '@/server/data';

export default async function HomePage() {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  const featured = programs.filter((p) => !isLayanan(p)).slice(0, FEATURED_PROGRAM_COUNT);

  return (
    <>
      <HeroSection />
      <SearchSection />
      <SectionsGrid />
      <FeaturedPrograms programs={featured} wilayah={wilayahFile.wilayah} builtOn={todayWIB()} />
      <HowItWorks />
      <TransparencyPreview />
      <TrustSection />
      <ClosingBanner />
    </>
  );
}
