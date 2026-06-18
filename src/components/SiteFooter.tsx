"use client";

export function SiteFooter() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0f0f0f] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-bold text-white">金锤葡萄酒</p>
            <p className="mt-4 text-sm text-gray-500">
              源自澳大利亚南澳产区，以匠心酿造每一瓶佳酿
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">快速链接</h4>
            <ul className="space-y-2">
              {[
                { id: "matrix", label: "品类矩阵" },
                { id: "products", label: "产品系列" },
                { id: "pricing", label: "定价体系" },
                { id: "contact", label: "渠道合作" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-sm text-gray-500 transition hover:text-[#d4af37]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">管理入口</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="/admin/series" className="hover:text-[#d4af37]">
                  系列管理
                </a>
              </li>
              <li>
                <a href="/admin/products" className="hover:text-[#d4af37]">
                  产品管理
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#2a2a2a] pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} 金锤葡萄酒 Golden Hammer
        </div>
      </div>
    </footer>
  );
}
