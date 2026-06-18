import Link from "next/link";
import { getAllSeries, readDb } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function AdminSeriesPage() {
  await ensureDbSeeded();
  const seriesList = await getAllSeries();
  const db = await readDb();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系列管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理产品系列，前台品类矩阵与系列区块将动态关联</p>
        </div>
        <Link
          href="/admin/series/new"
          className="rounded-lg bg-wine-800 px-4 py-2 text-sm font-semibold text-white hover:bg-wine-900"
        >
          + 添加系列
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">系列名称</th>
              <th className="px-4 py-3 font-medium">渠道标签</th>
              <th className="px-4 py-3 font-medium">产品数</th>
              <th className="px-4 py-3 font-medium">排序</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {seriesList.map((s) => {
              const count = db.products.filter((p) => p.seriesId === s.id).length;
              return (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.channelLabel || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{count}</td>
                  <td className="px-4 py-3 text-gray-600">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        s.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.published ? "已发布" : "隐藏"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/series/${s.id}/edit`} className="text-wine-700 hover:underline">
                      编辑
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
