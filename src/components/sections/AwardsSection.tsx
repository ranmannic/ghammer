const awards = [
  { title: "白金奖", score: "99", product: "大金锤" },
  { title: "金奖", score: "98", product: "小金锤" },
  { title: "金奖", score: "96", product: "金锤干白" },
  { title: "银奖", score: "95", product: "G系列" },
  { title: "银奖", score: "93", product: "G500" },
  { title: "银奖", score: "91", product: "大G" },
  { title: "Top100", score: "—", product: "品牌入选" },
  { title: "红五星", score: "—", product: "酒庄评级" },
];

export function AwardsSection() {
  return (
    <section id="awards" className="bg-[#0f0f0f] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="section-label mb-4 block">Awards</span>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">奖项与认可</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            金锤葡萄酒凭借卓越品质，在国际大赛中屡获殊荣
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <div
              key={award.title + award.product}
              className="card-dark group p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-[#d4af37]">{award.title}</h3>
              {award.score !== "—" && (
                <p className="mt-2 text-3xl font-bold text-white">{award.score}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">{award.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
