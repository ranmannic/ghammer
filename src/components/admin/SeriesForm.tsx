"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeriesForm({
  series,
}: {
  series?: {
    id: string;
    name: string;
    description: string;
    channelLabel: string;
    image: string;
    published: boolean;
    sortOrder: number;
  };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: series?.name ?? "",
    description: series?.description ?? "",
    channelLabel: series?.channelLabel ?? "",
    image: series?.image ?? "",
    published: series?.published ?? true,
    sortOrder: series?.sortOrder ?? 0,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = series ? `/api/series/${series.id}` : "/api/series";
    const method = series ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "保存失败");
      return;
    }
    router.push("/admin/series");
    router.refresh();
  }

  async function handleDelete() {
    if (!series || !confirm("确定删除此系列？系列下不能有产品。")) return;
    const res = await fetch(`/api/series/${series.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "删除失败");
      return;
    }
    router.push("/admin/series");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">系列信息</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">系列名称 *</label>
            <input
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">渠道标签</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              placeholder="如：团购渠道、电商渠道"
              value={form.channelLabel}
              onChange={(e) => setForm({ ...form, channelLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">排序</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              前台展示
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">系列描述</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">系列封面</label>
          <div className="mt-2 flex items-start gap-4">
            {form.image && (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                <Image src={form.image} alt="" fill className="object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </div>
        </div>
      </section>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-wine-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-wine-900 disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存系列"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
          取消
        </button>
        {series && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-lg border border-red-300 px-6 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            删除系列
          </button>
        )}
      </div>
    </form>
  );
}
