import Image from "next/image";
import Link from "next/link";
import { getAllProducts, readDb } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function AdminProductsPage() {
  await ensureDbSeeded();
  const products = await getAllProducts();
  const db = await readDb();
  const seriesMap = new Map(db.series.map((s) => [s.id, s.name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产品管理</h1>
          <p className="mt-1 text-sm text-gray-500">添加、编辑、删除产品及渠道定价</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-wine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-wine-900"
        >
          + 添加产品
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">产品</th>
              <th className="px-4 py-3 font-medium">系列</th>
              <th className="px-4 py-3 font-medium">定位</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                      {p.image ? (
                        <Image src={p.image} alt="" fill className="object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-lg">🍷</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seriesMap.get(p.seriesId) ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.positioning}</td>
                <td className="px-4 py-3 text-gray-600">{p.skus.length}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-wine-700 hover:underline">
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
