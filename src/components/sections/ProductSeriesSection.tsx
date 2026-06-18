"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import type { SeriesWithProducts } from "@/lib/types";

export function ProductSeriesSection({
  seriesList,
}: {
  seriesList: SeriesWithProducts[];
}) {
  const [openId, setOpenId] = useState<string | null>(
    seriesList.find((s) => s.products.length > 0)?.id ?? seriesList[0]?.id ?? null,
  );

  return (
    <section id="products" className="bg-[#1a1a1a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="section-label mb-4 block">Products</span>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">产品系列</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            按系列分类，点击展开查看各系列详细产品信息
          </p>
        </div>

        {seriesList.length === 0 ? (
          <p className="text-center text-gray-500">暂无产品系列</p>
        ) : (
          <div className="space-y-4">
            {seriesList.map((series) => {
              const isOpen = openId === series.id;
              return (
                <div key={series.id} className="overflow-hidden rounded-xl border border-[#2a2a2a]">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : series.id)}
                    className="flex w-full items-center justify-between bg-[#0f0f0f] px-6 py-5 text-left transition-colors hover:bg-[#141414]"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white">{series.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {series.channelLabel && (
                          <span className="mr-2 text-[#d4af37]/80">{series.channelLabel}</span>
                        )}
                        {series.products.length} 款产品
                      </p>
                      {series.description && (
                        <p className="mt-1 text-xs text-gray-600">{series.description}</p>
                      )}
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 shrink-0 text-[#d4af37] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#2a2a2a] bg-[#1a1a1a] p-6">
                      {series.products.length === 0 ? (
                        <p className="text-sm text-gray-600">该系列暂无产品</p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {series.products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="card-dark group overflow-hidden"
                            >
                              <div className="relative aspect-[3/4] bg-[#141414]">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-4xl opacity-30">
                                    🍷
                                  </div>
                                )}
                                {product.featured && (
                                  <span className="absolute left-3 top-3 rounded bg-[#d4af37] px-2 py-0.5 text-xs font-semibold text-[#1a1a1a]">
                                    旗舰
                                  </span>
                                )}
                              </div>
                              <div className="p-4">
                                <p className="text-xs text-[#d4af37]">{product.positioning}</p>
                                <h4 className="mt-1 text-lg font-bold text-white group-hover:text-[#d4af37]">
                                  {product.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {product.category} · {product.varietal}
                                </p>
                                {product.gwa && (
                                  <p className="mt-2 text-xs text-gray-600">GWA {product.gwa}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
