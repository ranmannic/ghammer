import { ProductForm } from "@/components/admin/ProductForm";
import { getAllSeries, getChannels } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function NewProductPage() {
  await ensureDbSeeded();
  const channels = await getChannels();
  const seriesList = await getAllSeries();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">添加产品</h1>
      {seriesList.length === 0 && (
        <p className="mt-2 text-sm text-amber-700">
          请先 <a href="/admin/series/new" className="underline">创建系列</a>，再添加产品。
        </p>
      )}
      <div className="mt-8">
        <ProductForm channels={channels} seriesList={seriesList} />
      </div>
    </div>
  );
}
