import type {
  Channel,
  PriceSegment,
  Product,
  ProductWithSeries,
  Series,
  SeriesWithProducts,
} from "./types";

export const PRICE_SEGMENTS: {
  id: PriceSegment;
  label: string;
  range: string;
}[] = [
  { id: "luxury", label: "奢华高端", range: "¥500+" },
  { id: "mid-high", label: "中高端", range: "¥200-¥500" },
  { id: "mid", label: "中端", range: "¥100-¥200" },
  { id: "entry", label: "大众入门", range: "<¥100" },
];

export function getPrimarySku(product: Product) {
  const sorted = [...product.skus].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted.find((s) => s.name.includes("单")) ?? sorted[0];
}

export function getPrimaryPrice(product: Product): number {
  const sku = getPrimarySku(product);
  if (!sku?.prices.length) return 0;
  return Math.min(...sku.prices.map((p) => p.price));
}

export function computePriceSegment(price: number): PriceSegment {
  if (price >= 500) return "luxury";
  if (price >= 200) return "mid-high";
  if (price >= 100) return "mid";
  return "entry";
}

export function resolvePriceSegment(product: Product): PriceSegment {
  if (product.priceSegment) return product.priceSegment;
  return computePriceSegment(getPrimaryPrice(product));
}

export function enrichProducts(
  products: Product[],
  seriesList: Series[],
): ProductWithSeries[] {
  const map = new Map(seriesList.map((s) => [s.id, s.name]));
  return products.map((p) => ({
    ...p,
    seriesName: map.get(p.seriesId) ?? "未分类",
  }));
}

export function groupSeriesWithProducts(
  seriesList: Series[],
  products: Product[],
): SeriesWithProducts[] {
  return seriesList
    .filter((s) => s.published)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((series) => ({
      ...series,
      products: products
        .filter((p) => p.seriesId === series.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}

export function groupProductsByPriceSegment(
  products: ProductWithSeries[],
): Record<PriceSegment, ProductWithSeries[]> {
  const result: Record<PriceSegment, ProductWithSeries[]> = {
    luxury: [],
    "mid-high": [],
    mid: [],
    entry: [],
  };
  for (const p of products) {
    result[resolvePriceSegment(p)].push(p);
  }
  return result;
}

export function getPriceForChannel(
  sku: ReturnType<typeof getPrimarySku>,
  channelId: string,
): number | null {
  if (!sku) return null;
  return sku.prices.find((p) => p.channelId === channelId)?.price ?? null;
}

export function getChannelTags(product: Product, channels: Channel[]): string[] {
  const primary = getPrimarySku(product);
  if (!primary) return [];
  return channels
    .filter((ch) => getPriceForChannel(primary, ch.id) != null)
    .map((ch) => ch.name);
}

export function matchProductSearch(product: ProductWithSeries, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const haystack = [
    product.name,
    product.seriesName,
    product.category,
    product.varietal,
    product.positioning,
    product.description,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function getMatrixStats(products: Product[]) {
  const segments = new Set(products.map((p) => resolvePriceSegment(p)));
  const scores = products
    .map((p) => {
      const m = p.gwa.match(/(\d{2,3})/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => n > 0);
  return {
    productCount: products.length,
    segmentCount: segments.size,
    maxScore: scores.length ? Math.max(...scores) : 99,
  };
}
