import type { Product } from "@/lib/types";

const specs: { key: keyof Product; label: string }[] = [
  { key: "gwa", label: "GWA 评级" },
  { key: "region", label: "产区" },
  { key: "vineAge", label: "葡萄藤龄" },
  { key: "oakGrade", label: "橡木桶等级" },
  { key: "oakAging", label: "橡木桶陈酿" },
  { key: "alcohol", label: "酒精度" },
  { key: "category", label: "品类" },
  { key: "varietal", label: "品种" },
  { key: "wineStyle", label: "酒型" },
  { key: "bottleType", label: "瓶型" },
];

export function SpecGrid({ product }: { product: Product }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {specs.map(({ key, label }) => {
        const value = product[key];
        if (!value || typeof value !== "string") return null;
        return (
          <div key={key} className="card-dark px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#d4af37]/80">
              {label}
            </p>
            <p className="mt-1 font-medium text-white">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
