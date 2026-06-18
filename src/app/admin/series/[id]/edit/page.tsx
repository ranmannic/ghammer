import { notFound } from "next/navigation";
import { SeriesForm } from "@/components/admin/SeriesForm";
import { getSeriesById } from "@/lib/db";
import { ensureDbSeeded } from "@/lib/init-db";

export default async function EditSeriesPage({
  params,
}: {
  params: { id: string };
}) {
  await ensureDbSeeded();
  const series = await getSeriesById(params.id);
  if (!series) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">编辑系列 · {series.name}</h1>
      <div className="mt-8">
        <SeriesForm series={series} />
      </div>
    </div>
  );
}
