import { AwardIcon, MapPinIcon, WineIcon } from "@/components/icons";

const features = [
  {
    icon: MapPinIcon,
    title: "南澳产区",
    desc: "源自澳大利亚著名葡萄酒产区，得天独厚的气候与土壤条件",
  },
  {
    icon: WineIcon,
    title: "老藤酿造",
    desc: "精选20-40年以上老藤葡萄，产量稀少但品质卓越",
  },
  {
    icon: WineIcon,
    title: "匠心陈酿",
    desc: "6-14个月法国橡木桶陈酿，赋予酒体复杂层次",
  },
  {
    icon: AwardIcon,
    title: "国际认可",
    desc: "荣获多项国际葡萄酒大赛金奖及银奖殊荣",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#1a1a1a] py-24 sm:py-32">
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-5">
        <div
          className="h-full w-full bg-gradient-to-l from-[#d4af37]/20 to-transparent"
          style={{ filter: "grayscale(100%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="section-label mb-4 block">About Us</span>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              纯正酿造
              <span className="block text-[#d4af37]">匠心传承</span>
            </h2>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-400">
                每一瓶金锤葡萄酒都捕捉了澳大利亚葡萄园的阳光精髓。我们坚持选用南澳产区最优质的老藤葡萄，
                以传统工艺与现代技术相结合的方式，酿造出具有独特风土特色的佳酿。
              </p>
              <p className="leading-relaxed text-gray-500">
                从葡萄种植到装瓶出厂，每一个环节都经过严格把控。我们相信，真正的好酒需要时间的沉淀，
                需要匠人的专注，更需要对品质的执着追求。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-dark group p-5">
                <Icon className="mb-3 h-8 w-8 text-[#d4af37] transition-transform group-hover:scale-110" />
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
