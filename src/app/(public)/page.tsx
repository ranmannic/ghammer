import { AboutSection } from "@/components/sections/AboutSection";
import { AwardsSection } from "@/components/sections/AwardsSection";
import { CategoryMatrixSection } from "@/components/sections/CategoryMatrixSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProductSeriesSection } from "@/components/sections/ProductSeriesSection";
import {
  getChannels,
  getPublishedProducts,
  getPublishedSeries,
  getSeriesWithProducts,
} from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";
import { enrichProducts, getMatrixStats } from "@/lib/product-utils";

export default async function HomePage() {
  await ensureDbSeeded();
  const products = await getPublishedProducts();
  const channels = await getChannels();
  const seriesList = await getSeriesWithProducts();
  const publishedSeries = await getPublishedSeries();
  const enriched = enrichProducts(products, publishedSeries);
  const stats = getMatrixStats(products);

  return (
    <main>
      <HeroSection
        seriesCount={publishedSeries.length}
        maxScore={stats.maxScore}
      />
      <AboutSection />
      <CategoryMatrixSection products={enriched} />
      <ProductSeriesSection seriesList={seriesList} />
      <PricingSection products={enriched} channels={channels} />
      <AwardsSection />
      <ContactSection />
    </main>
  );
}
