"use client";

import { ChevronDownIcon, WineIcon } from "@/components/icons";

export function HeroSection({
  seriesCount,
  maxScore,
}: {
  seriesCount: number;
  maxScore: number;
}) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f0f0f]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="animate-grain h-[200%] w-[200%]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div
        className="animate-pulse-glow absolute h-[600px] w-[600px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgb(212, 175, 55) 0%, transparent 70%)",
          left: "20%",
          top: "30%",
        }}
      />
      <div
        className="animate-pulse-glow absolute h-[400px] w-[400px] rounded-full opacity-15 blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgb(139, 0, 0) 0%, transparent 70%)",
          right: "15%",
          bottom: "20%",
          animationDelay: "1.5s",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d4af37]">
          <WineIcon className="h-10 w-10 text-[#d4af37]" />
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="text-[#d4af37]">G</span>hammer
        </h1>
        <h2 className="mb-4 text-3xl font-light tracking-widest text-white sm:text-4xl md:text-5xl">
          金锤葡萄酒
        </h2>
        <p className="mx-auto mb-4 max-w-2xl text-lg font-light tracking-wide text-gray-400 sm:text-xl">
          品味自然的精髓
        </p>
        <p className="mx-auto mb-12 max-w-xl text-sm text-gray-500 sm:text-base">
          澳大利亚南澳产区 · 老藤酿造 · 匠心传承
        </p>

        <button type="button" onClick={() => scrollTo("matrix")} className="btn-gold-outline group">
          <span>探索系列</span>
          <ChevronDownIcon className="relative h-5 w-5 animate-bounce" />
        </button>

        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8">
          {[
            { value: "40+", label: "年老藤" },
            { value: String(seriesCount), label: "大系列" },
            { value: String(maxScore), label: "最高分" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-1 text-2xl font-bold text-[#d4af37] sm:text-3xl md:text-4xl">
                {stat.value}
              </div>
              <div className="text-xs tracking-wider text-gray-500 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
    </section>
  );
}
