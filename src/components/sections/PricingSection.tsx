"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import {
  getChannelTags,
  getPriceForChannel,
  getPrimarySku,
  matchProductSearch,
} from "@/lib/product-utils";
import type { Channel, ProductWithSeries } from "@/lib/types";

export function PricingSection({
  products,
  channels,
}: {
  products: ProductWithSeries[];
  channels: Channel[];
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => products.filter((p) => matchProductSearch(p, query)),
    [products, query],
  );

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="pricing" className="bg-white py-24 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900">定价体系</h2>
          <p className="mt-2 text-gray-500">
            默认展示单支价格，点击展开查看双支、整箱价格
          </p>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="搜索产品名称、品类、品种..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-4 font-semibold text-gray-700">产品</th>
                  {channels.map((ch) => (
                    <th key={ch.id} className="px-4 py-4 text-center font-semibold text-gray-700">
                      {ch.name}
                    </th>
                  ))}
                  <th className="px-4 py-4 font-semibold text-gray-700">适配渠道</th>
                  <th className="w-12 px-2 py-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const primary = getPrimarySku(product);
                  const isOpen = expanded.has(product.id);
                  const tags = getChannelTags(product, channels);

                  return (
                    <Fragment key={product.id}>
                      <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50/80">
                        <td className="px-4 py-4">
                          <Link
                            href={`/products/${product.slug}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full items-center justify-center text-lg">
                                  🍷
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-[#d4af37]">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.category} · {product.varietal}
                              </p>
                            </div>
                          </Link>
                        </td>
                        {channels.map((ch) => {
                          const price = getPriceForChannel(primary, ch.id);
                          return (
                            <td key={ch.id} className="px-4 py-4 text-center">
                              {price != null ? (
                                <span className="text-lg font-bold text-brand-price">
                                  ¥{price}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {tags.map((t) => (
                              <span
                                key={t}
                                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <button
                            type="button"
                            onClick={() => toggleExpand(product.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            aria-label="展开价格"
                          >
                            <ChevronDownIcon
                              className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </td>
                      </tr>
                      {isOpen &&
                        [...product.skus]
                          .sort((a, b) => a.sortOrder - b.sortOrder)
                          .filter((s) => s.id !== primary?.id)
                          .map((sku) => (
                            <tr
                              key={sku.id}
                              className="border-b border-gray-50 bg-gray-50/50"
                            >
                              <td className="px-4 py-3 pl-16 text-gray-600">
                                {sku.name}
                                <span className="ml-2 text-xs text-gray-400">
                                  {sku.salesSpec}
                                </span>
                              </td>
                              {channels.map((ch) => {
                                const price = getPriceForChannel(sku, ch.id);
                                return (
                                  <td key={ch.id} className="px-4 py-3 text-center">
                                    {price != null ? (
                                      <span className="font-semibold text-brand-price">
                                        ¥{price}
                                      </span>
                                    ) : (
                                      <span className="text-gray-300">—</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td colSpan={2} />
                            </tr>
                          ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ChannelPolicy />
      </div>
    </section>
  );
}

function ChannelPolicy() {
  const policies = [
    {
      title: "经销商合作",
      items: ["起订量灵活，支持混批", "价格阶梯优惠", "区域保护政策", "专属业务经理对接"],
    },
    {
      title: "商超渠道",
      items: ["专属陈列设计方案", "促销物料支持", "联合营销活动", "定期培训支持"],
    },
    {
      title: "电商合作",
      items: ["一件代发支持", "完整素材包提供", "佣金比例优厚", "直播带货支持"],
    },
  ];

  return (
    <div className="mt-16">
      <h3 className="mb-8 text-2xl font-bold text-gray-900">渠道合作政策</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {policies.map((p) => (
          <div key={p.title} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h4 className="mb-4 font-bold text-gray-900">{p.title}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {p.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
