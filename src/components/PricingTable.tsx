"use client";

import { useMemo, useState } from "react";
import type { Channel, Product } from "@/lib/types";

export function PricingTable({
  product,
  channels,
}: {
  product: Product;
  channels: Channel[];
}) {
  const [activeChannelId, setActiveChannelId] = useState(channels[0]?.id ?? "");

  const rows = useMemo(() => {
    return [...product.skus]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((sku) => {
        const price =
          sku.prices.find((p) => p.channelId === activeChannelId)?.price ?? null;
        return { sku, price };
      });
  }, [product.skus, activeChannelId]);

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] p-6">
      <h3 className="text-xl font-bold text-white">渠道定价体系</h3>
      <p className="mt-1 text-sm text-gray-500">零售价（元）· 按平台与规格展示</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {channels.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setActiveChannelId(ch.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeChannelId === ch.id
                ? "bg-[#d4af37] text-[#1a1a1a]"
                : "border border-[#2a2a2a] text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]"
            }`}
          >
            {ch.name}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-gray-500">
              <th className="pb-3 pr-4 font-medium">SKU 规格</th>
              <th className="pb-3 pr-4 font-medium">销售规格</th>
              <th className="pb-3 text-right font-medium">
                {activeChannel?.name ?? "渠道"} 零售价
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ sku, price }) => (
              <tr key={sku.id} className="border-b border-[#2a2a2a]/50 last:border-0">
                <td className="py-3 pr-4 font-medium text-white">{sku.name}</td>
                <td className="py-3 pr-4 text-gray-500">{sku.salesSpec}</td>
                <td className="py-3 text-right text-lg font-bold text-[#e67e22]">
                  {price != null ? `¥${price}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
