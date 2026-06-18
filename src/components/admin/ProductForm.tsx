"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Channel, Product, ProductSku, Series } from "@/lib/types";

type FormSku = Omit<ProductSku, "id"> & { id?: string };

const PRICE_SEGMENT_OPTIONS = [
  { value: "", label: "自动（按单支最低价）" },
  { value: "luxury", label: "奢华高端 ¥500+" },
  { value: "mid-high", label: "中高端 ¥200-500" },
  { value: "mid", label: "中端 ¥100-200" },
  { value: "entry", label: "大众入门 <¥100" },
];

const emptySku = (channels: Channel[]): FormSku => ({
  name: "",
  salesSpec: "",
  sortOrder: 0,
  prices: channels.map((c) => ({ channelId: c.id, price: 0 })),
});

export function ProductForm({
  product,
  channels,
  seriesList,
}: {
  product?: Product;
  channels: Channel[];
  seriesList: Series[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    seriesId: product?.seriesId ?? seriesList[0]?.id ?? "",
    positioning: product?.positioning ?? "",
    category: product?.category ?? "",
    varietal: product?.varietal ?? "",
    wineStyle: product?.wineStyle ?? "",
    bottleType: product?.bottleType ?? "",
    gwa: product?.gwa ?? "",
    region: product?.region ?? "",
    vineAge: product?.vineAge ?? "",
    oakGrade: product?.oakGrade ?? "",
    oakAging: product?.oakAging ?? "",
    alcohol: product?.alcohol ?? "",
    description: product?.description ?? "",
    image: product?.image ?? "",
    priceSegment: product?.priceSegment ?? "",
    featured: product?.featured ?? false,
    published: product?.published ?? true,
    sortOrder: product?.sortOrder ?? 0,
  });

  const [skus, setSkus] = useState<FormSku[]>(
    product?.skus?.length
      ? product.skus.map((s) => ({
          id: s.id,
          name: s.name,
          salesSpec: s.salesSpec,
          sortOrder: s.sortOrder,
          prices: channels.map((c) => {
            const found = s.prices.find((p) => p.channelId === c.id);
            return { channelId: c.id, price: found?.price ?? 0 };
          }),
        }))
      : [emptySku(channels)],
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "上传失败");
      return;
    }
    setForm((f) => ({ ...f, image: data.url }));
  }

  function updateSku(index: number, patch: Partial<FormSku>) {
    setSkus((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function updateSkuPrice(skuIndex: number, channelId: string, price: number) {
    setSkus((prev) =>
      prev.map((s, i) =>
        i === skuIndex
          ? {
              ...s,
              prices: s.prices.map((p) =>
                p.channelId === channelId ? { ...p, price } : p,
              ),
            }
          : s,
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.seriesId) {
      setError("请选择所属系列");
      return;
    }
    setSaving(true);
    setError("");

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skus }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "保存失败");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !confirm("确定删除此产品？")) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="产品名称 *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="block text-sm font-medium text-gray-700">所属系列 *</label>
            <select
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={form.seriesId}
              onChange={(e) => setForm({ ...form, seriesId: e.target.value })}
            >
              <option value="">请选择系列</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Field label="渠道定位" value={form.positioning} onChange={(v) => setForm({ ...form, positioning: v })} />
          <Field label="品类" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field label="品种" value={form.varietal} onChange={(v) => setForm({ ...form, varietal: v })} />
          <Field label="酒型" value={form.wineStyle} onChange={(v) => setForm({ ...form, wineStyle: v })} />
          <Field label="瓶型" value={form.bottleType} onChange={(v) => setForm({ ...form, bottleType: v })} />
          <div>
            <label className="block text-sm font-medium text-gray-700">品类矩阵价格段</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={form.priceSegment}
              onChange={(e) => setForm({ ...form, priceSegment: e.target.value as typeof form.priceSegment })}
            >
              {PRICE_SEGMENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Field label="排序" type="number" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: Number(v) })} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">产品描述</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            旗舰推荐
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            前台展示
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">产品图片</h2>
        <div className="mt-4 flex items-start gap-6">
          {form.image && (
            <div className="relative h-40 w-32 overflow-hidden rounded-lg border">
              <Image src={form.image} alt="产品图" fill className="object-cover" />
            </div>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            <p className="mt-1 text-xs text-gray-500">{uploading ? "上传中…" : "支持 JPG/PNG/WebP，最大 5MB"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">技术参数</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="GWA 评级" value={form.gwa} onChange={(v) => setForm({ ...form, gwa: v })} />
          <Field label="产区" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
          <Field label="葡萄藤龄" value={form.vineAge} onChange={(v) => setForm({ ...form, vineAge: v })} />
          <Field label="橡木桶等级" value={form.oakGrade} onChange={(v) => setForm({ ...form, oakGrade: v })} />
          <Field label="橡木桶陈酿" value={form.oakAging} onChange={(v) => setForm({ ...form, oakAging: v })} />
          <Field label="酒精度" value={form.alcohol} onChange={(v) => setForm({ ...form, alcohol: v })} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">SKU 规格与渠道定价</h2>
          <button
            type="button"
            onClick={() => setSkus((s) => [...s, emptySku(channels)])}
            className="text-sm text-wine-700 hover:underline"
          >
            + 添加 SKU
          </button>
        </div>
        {skus.map((sku, idx) => (
          <div key={idx} className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">SKU #{idx + 1}</span>
              {skus.length > 1 && (
                <button type="button" onClick={() => setSkus((s) => s.filter((_, i) => i !== idx))} className="text-xs text-red-600">
                  删除
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="SKU 名称" value={sku.name} onChange={(v) => updateSku(idx, { name: v })} />
              <Field label="销售规格" value={sku.salesSpec} onChange={(v) => updateSku(idx, { salesSpec: v })} />
              <Field label="排序" type="number" value={String(sku.sortOrder)} onChange={(v) => updateSku(idx, { sortOrder: Number(v) })} />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {channels.map((ch) => {
                const price = sku.prices.find((p) => p.channelId === ch.id)?.price ?? 0;
                return (
                  <div key={ch.id}>
                    <label className="text-xs text-gray-500">{ch.name} (¥)</label>
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900"
                      value={price}
                      onChange={(e) => updateSkuPrice(idx, ch.id, Number(e.target.value))}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-wine-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-wine-900 disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存产品"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
          取消
        </button>
        {product && (
          <button type="button" onClick={handleDelete} className="ml-auto rounded-lg border border-red-300 px-6 py-2.5 text-sm text-red-600 hover:bg-red-50">
            删除产品
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={label.includes("*")}
      />
    </div>
  );
}
