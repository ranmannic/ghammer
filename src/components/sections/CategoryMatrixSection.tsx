"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductWithSeries } from "@/lib/types";
import {
  USD_TO_CNY,
  formatCnyRange,
  formatPriceSegmentRange,
  getLevel1ShareData,
  getMatrixDisplayStats,
  getPriceSegmentMarketData,
  getTotalMarketVolume,
  mapProductsToMatrix,
} from "@/lib/wine-category-matrix";

const LEVEL1_COLORS = ["#d4af37", "#8b0000", "#c41e3a", "#e8c547"];
const PRICE_COLORS = ["#d4af37", "#c41e3a", "#8b0000", "#a0522d", "#666666"];

function ShareBar({
  items,
  colors,
  valueKey = "value",
}: {
  items: { name: string; [key: string]: string | number }[];
  colors: string[];
  valueKey?: string;
}) {
  const total = items.reduce((sum, item) => sum + Number(item[valueKey]), 0);
  if (total === 0) return null;

  return (
    <div>
      <div className="flex h-4 overflow-hidden rounded-full">
        {items.map((item, i) => (
          <div
            key={item.name}
            style={{
              width: `${(Number(item[valueKey]) / total) * 100}%`,
              backgroundColor: colors[i % colors.length],
            }}
            title={`${item.name}: ${((Number(item[valueKey]) / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-1 text-xs text-gray-500">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            {item.name} {((Number(item[valueKey]) / total) * 100).toFixed(0)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryMatrixSection({
  products,
}: {
  products: ProductWithSeries[];
}) {
  const [tab, setTab] = useState<"overview" | "category" | "price">("category");

  const matrix = useMemo(() => mapProductsToMatrix(products), [products]);
  const displayStats = useMemo(() => getMatrixDisplayStats(products), [products]);
  const level1Share = useMemo(() => getLevel1ShareData(), []);
  const priceSegments = useMemo(() => getPriceSegmentMarketData(products), [products]);
  const maxSegmentVolume = Math.max(...priceSegments.map((s) => s.volume), 1);

  return (
    <section id="matrix" className="bg-[#141414] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-label mb-4 block">Wine Category Matrix</span>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">品类矩阵</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            全球葡萄酒市场分类体系，汇率：1 USD = {USD_TO_CNY} CNY
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: String(getTotalMarketVolume()), label: "全球市场体量(十亿美元)" },
            { value: String(displayStats.subCategoryCount), label: "细分品类" },
            { value: String(displayStats.coveredCategoryCount), label: "金锤覆盖品类" },
            { value: String(displayStats.productCount), label: "金锤产品总数" },
          ].map((s) => (
            <div key={s.label} className="card-dark p-5 text-center">
              <div className="text-3xl font-bold text-[#d4af37]">{s.value}</div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-lg bg-[#1a1a1a] p-1 w-fit mx-auto">
          {[
            { id: "overview" as const, label: "总览" },
            { id: "category" as const, label: "按品类" },
            { id: "price" as const, label: "按价格段" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-6 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-[#d4af37] text-[#1a1a1a]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card-dark p-6">
                <h3 className="mb-4 font-semibold text-white">全球葡萄酒一级分类占比</h3>
                <ShareBar items={level1Share} colors={LEVEL1_COLORS} />
              </div>
              <div className="card-dark p-6">
                <h3 className="mb-4 font-semibold text-white">价格段市场分布（人民币）</h3>
                <ShareBar
                  items={priceSegments.filter((s) => s.volume > 0).map((s) => ({
                    name: `${s.label} (${formatPriceSegmentRange(s.range)})`,
                    value: s.volume,
                  }))}
                  colors={PRICE_COLORS}
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#d4af37]/30 bg-gradient-to-r from-[#d4af37]/10 to-[#8b0000]/10 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">金锤系列产品定位</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {priceSegments
                  .filter((s) => s.ghammerProducts.length > 0)
                  .map((seg) => (
                    <div key={seg.label} className="rounded-lg bg-[#0f0f0f]/50 p-4">
                      <div className="mb-2 font-semibold text-[#d4af37]">
                        {seg.label}
                        <span className="ml-2 text-sm font-normal text-gray-400">
                          ({formatPriceSegmentRange(seg.range)})
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {seg.ghammerProducts.map((label) => (
                          <li key={label} className="text-sm text-white">
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {tab === "category" && (
          <div className="card-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead className="bg-[#0f0f0f]">
                  <tr>
                    {["一级分类", "二级分类", "三级分类", "四级分类（价格段）", "市场体量($B)", "全球占比(%)", "金锤产品"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 text-sm font-medium text-gray-400 ${
                            h.includes("市场") || h.includes("占比") ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {matrix.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-[#0f0f0f] ${
                        row.matchedProducts.length > 0 ? "bg-[#d4af37]/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-white">{row.level1}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.level2}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{row.level3}</td>
                      <td className="px-4 py-3 text-sm">
                        {row.priceRangeCny ? (
                          <>
                            <span className="text-white">{row.level4}</span>
                            <br />
                            <span className="text-xs text-[#d4af37]">
                              {formatCnyRange(row.priceRangeCny)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-300">{row.level4}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-white">
                        {row.marketVolume}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-400">
                        {row.globalShare}%
                      </td>
                      <td className="px-4 py-3">
                        {row.matchedProducts.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {row.matchedProducts.map((p) => (
                              <Link
                                key={p.id}
                                href={`/products/${p.slug}`}
                                className="inline-flex w-fit items-center gap-1 rounded bg-[#d4af37]/20 px-2 py-0.5 text-xs text-[#d4af37] hover:bg-[#d4af37]/30"
                              >
                                {p.name} ¥{p.price}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "price" && (
          <div className="space-y-8">
            <div className="card-dark p-6">
              <h3 className="mb-6 font-semibold text-white">价格段市场体量对比</h3>
              <div className="space-y-4">
                {priceSegments
                  .filter((s) => s.volume > 0)
                  .map((seg, i) => (
                    <div key={seg.label}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-300">
                          {seg.label}
                          <span className="ml-2 text-gray-500">
                            ({formatPriceSegmentRange(seg.range)})
                          </span>
                        </span>
                        <span className="font-medium text-[#d4af37]">${seg.volume}B</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#2a2a2a]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(seg.volume / maxSegmentVolume) * 100}%`,
                            backgroundColor: PRICE_COLORS[i % PRICE_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {priceSegments
                .filter((s) => s.ghammerProducts.length > 0)
                .map((seg) => (
                  <div
                    key={seg.label}
                    className="card-dark relative overflow-hidden border-[#d4af37]/30 p-6"
                  >
                    <div className="absolute right-0 top-0 h-20 w-20 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/5" />
                    <h4 className="text-lg font-bold text-white">{seg.label}</h4>
                    <p className="mt-2 text-sm text-gray-400">
                      人民币价格区间：{formatPriceSegmentRange(seg.range)}
                      <br />
                      市场体量：${seg.volume}B
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-[#d4af37]">
                        金锤产品
                      </div>
                      {seg.ghammerProducts.map((label) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 rounded-lg bg-[#0f0f0f] p-3"
                        >
                          <span className="text-sm font-medium text-white">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
