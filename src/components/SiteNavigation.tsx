"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WineIcon } from "./icons";

const NAV_ITEMS = [
  { id: "hero", label: "首页" },
  { id: "about", label: "品牌介绍" },
  { id: "matrix", label: "品类矩阵" },
  { id: "products", label: "产品系列" },
  { id: "pricing", label: "定价体系" },
  { id: "awards", label: "奖项荣誉" },
  { id: "contact", label: "渠道合作" },
];

export function SiteNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#2a2a2a]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d4af37]">
              <WineIcon className="h-4 w-4 text-[#d4af37]" />
            </div>
            <span className="font-bold text-white">金锤葡萄酒</span>
          </button>

          <div className="hidden items-center gap-5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-sm text-gray-300 transition-colors hover:text-[#d4af37]"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/admin"
              className="text-xs text-gray-500 transition-colors hover:text-[#d4af37]"
            >
              管理
            </Link>
          </div>

          <button
            type="button"
            className="p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#2a2a2a] py-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="block w-full px-2 py-2.5 text-left text-sm text-gray-300 hover:text-[#d4af37]"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
