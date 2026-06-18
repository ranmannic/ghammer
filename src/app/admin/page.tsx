import Link from "next/link";
import { getAllProducts, getAllSeries } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function AdminDashboardPage() {
  await ensureDbSeeded();
  const products = await getAllProducts();
  const series = await getAllSeries();
  const published = products.filter((p) => p.published).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
      <p className="mt-1 text-gray-500">金锤葡萄酒 · 系列与产品管理</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="产品系列" value={String(series.length)} />
        <StatCard label="产品总数" value={String(products.length)} />
        <StatCard label="已发布产品" value={String(published)} />
        <StatCard label="草稿/隐藏" value={String(products.length - published)} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/series/new"
          className="inline-flex rounded-lg border border-wine-200 px-5 py-2.5 text-sm font-semibold text-wine-800 hover:bg-wine-50"
        >
          + 添加系列
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-lg bg-wine-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wine-900"
        >
          + 添加产品
        </Link>
        <Link
          href="/admin/series"
          className="inline-flex rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          管理系列
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          管理产品
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-wine-900">{value}</p>
    </div>
  );
}
