import { SeriesForm } from "@/components/admin/SeriesForm";

export default function NewSeriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">添加系列</h1>
      <div className="mt-8">
        <SeriesForm />
      </div>
    </div>
  );
}
