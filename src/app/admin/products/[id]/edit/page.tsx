import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllSeries, getChannels, getProductById } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await ensureDbSeeded();
  const product = await getProductById(params.id);
  if (!product) notFound();

  const channels = await getChannels();
  const seriesList = await getAllSeries();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">编辑产品 · {product.name}</h1>
      <div className="mt-8">
        <ProductForm product={product} channels={channels} seriesList={seriesList} />
      </div>
    </div>
  );
}
