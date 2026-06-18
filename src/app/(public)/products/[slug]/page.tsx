import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PricingTable } from "@/components/PricingTable";
import { SpecGrid } from "@/components/SpecGrid";
import { WineIcon } from "@/components/icons";
import { enrichProduct, getChannels, getProductBySlug } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";
import { getPrimaryPrice, getPriceForChannel, getPrimarySku } from "@/lib/product-utils";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await ensureDbSeeded();
  const raw = await getProductBySlug(params.slug);
  if (!raw) notFound();

  const product = await enrichProduct(raw);
  const channels = await getChannels();
  const primary = getPrimarySku(product);

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#d4af37]"
        >
          ← 返回产品系列
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-600">
                <WineIcon className="h-16 w-16 text-[#d4af37]/30" />
                <span className="text-sm">产品图待上传</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1 text-xs text-[#d4af37]">
                {product.seriesName}
              </span>
              <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs text-gray-400">
                {product.positioning}
              </span>
              {product.featured && (
                <span className="rounded-full bg-[#d4af37] px-3 py-1 text-xs font-semibold text-[#1a1a1a]">
                  旗舰产品
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">{product.name}</h1>
            <p className="mt-2 text-lg text-gray-400">
              {product.category} · {product.varietal}
            </p>

            <p className="mt-4 text-2xl font-bold text-[#e67e22]">
              单支零售价 ¥{getPrimaryPrice(product)}
            </p>

            {primary && (
              <div className="mt-4 flex flex-wrap gap-3">
                {channels.map((ch) => {
                  const price = getPriceForChannel(primary, ch.id);
                  if (price == null) return null;
                  return (
                    <div
                      key={ch.id}
                      className="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2"
                    >
                      <p className="text-xs text-gray-500">{ch.name}</p>
                      <p className="text-lg font-bold text-[#e67e22]">¥{price}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-8 text-lg leading-relaxed text-gray-400">{product.description}</p>

            {product.gwa && (
              <p className="mt-4 text-sm text-[#d4af37]">GWA · {product.gwa}</p>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-white">产品参数</h2>
          <SpecGrid product={product} />
        </section>

        <section className="mt-16">
          <PricingTable product={product} channels={channels} />
        </section>
      </div>
    </div>
  );
}
