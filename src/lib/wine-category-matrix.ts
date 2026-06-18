import type { Product, ProductWithSeries } from "./types";
import { getPrimaryPrice } from "./product-utils";

export const USD_TO_CNY = 6.77;

export type WineCategoryCell = {
  id: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  marketVolume: number;
  globalShare: number;
  topBrands: string;
  trend: string;
  priceRangeCny: [number, number] | null;
};

export type MatrixCellWithProducts = WineCategoryCell & {
  matchedProducts: { id: string; name: string; slug: string; price: number }[];
};

export type PriceSegmentMarket = {
  label: string;
  range: [number, number];
  volume: number;
  ghammerProducts: string[];
};

const PRODUCT_CATEGORY_MAP: Record<string, { level2: string; level3: string }> = {
  干红: { level2: "红葡萄酒", level3: "干型 (>4g/L)" },
  干白: { level2: "白葡萄酒", level3: "干型 (>4g/L)" },
  脱醇: { level2: "其他（果酒/低度/RTD）", level3: "甜型/半甜" },
};

/** 全球葡萄酒 27 细分品类矩阵（行业静态数据） */
export const WINE_CATEGORY_MATRIX: WineCategoryCell[] = [
  { id: "cat-0", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "干型 (>4g/L)", level4: "奢华高端 >$80/瓶", marketVolume: 30, globalShare: 6, topBrands: "拉菲 | 奔富Grange | 罗曼尼康帝 | 木桐", trend: "顶级名庄，投资收藏，年增速3-4%", priceRangeCny: [542, Infinity] },
  { id: "cat-1", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "干型 (>4g/L)", level4: "中高端 $30-80/瓶", marketVolume: 75, globalShare: 15, topBrands: "奔富Bin389/407 | 金锤Ghammer | 纷赋", trend: "商务宴请核心价位，增速5-6%", priceRangeCny: [203, 542] },
  { id: "cat-2", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "干型 (>4g/L)", level4: "中端 $15-30/瓶", marketVolume: 40, globalShare: 8, topBrands: "杰卡斯 | 桃乐丝 | 黄尾袋鼠签名版", trend: "品质口粮酒，电商主力，增速4-5%", priceRangeCny: [102, 203] },
  { id: "cat-3", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "干型 (>4g/L)", level4: "大众入门 <$15/瓶", marketVolume: 15, globalShare: 3, topBrands: "黄尾袋鼠 | 张裕 | 长城", trend: "日常佐餐，价格敏感，增速放缓2-3%", priceRangeCny: [0, 102] },
  { id: "cat-4", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "半干 (4-12g/L)", level4: "全价格带", marketVolume: 22, globalShare: 4.4, topBrands: "各类德国半干红 | 新世界半干红", trend: "入门友好型，亚洲偏好，增速4%", priceRangeCny: null },
  { id: "cat-5", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "半甜 (12-45g/L)", level4: "全价格带", marketVolume: 12, globalShare: 2.4, topBrands: "意大利Lambrusco | 部分国产甜红", trend: "年轻消费者/女性偏好，增速5%", priceRangeCny: null },
  { id: "cat-6", level1: "静态葡萄酒", level2: "红葡萄酒", level3: "甜型 (>45g/L)", level4: "全价格带", marketVolume: 6, globalShare: 1.2, topBrands: "波特甜红 | 加强甜红", trend: "小众品类，与加强酒重叠，增速3%", priceRangeCny: null },
  { id: "cat-7", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "干型 (>4g/L)", level4: "高端 >$30/瓶", marketVolume: 15, globalShare: 3, topBrands: "云雾之湾 | 路易亚都 | 勃艮第白", trend: "精品餐饮渠道，增速6-7%", priceRangeCny: [203, Infinity] },
  { id: "cat-8", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "干型 (>4g/L)", level4: "中端 $10-30/瓶", marketVolume: 45, globalShare: 9, topBrands: "杰卡斯霞多丽 | 张裕雷司令 | 奔富洛神山庄白", trend: "主流消费，餐饮+电商双渠道，增速5%", priceRangeCny: [68, 203] },
  { id: "cat-9", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "干型 (>4g/L)", level4: "大众 <$10/瓶", marketVolume: 30, globalShare: 6, topBrands: "黄尾袋鼠莫斯卡托干白 | 国产白葡萄酒", trend: "入门易饮，夏季消费高峰，增速4%", priceRangeCny: [0, 68] },
  { id: "cat-10", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "半干 (4-12g/L)", level4: "全价格带", marketVolume: 20, globalShare: 4, topBrands: "德国雷司令半干 | 阿尔萨斯灰皮诺", trend: "德国/阿尔萨斯核心品类，增速4%", priceRangeCny: null },
  { id: "cat-11", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "半甜 (12-45g/L)", level4: "全价格带", marketVolume: 15, globalShare: 3, topBrands: "各类莫斯卡托半甜 | 甜白起泡", trend: "女性/年轻消费者首选，增速6%", priceRangeCny: null },
  { id: "cat-12", level1: "静态葡萄酒", level2: "白葡萄酒", level3: "甜型 (>45g/L)", level4: "全价格带", marketVolume: 5, globalShare: 1, topBrands: "贵腐甜白 | 冰酒 | 托卡伊", trend: "与甜酒品类重叠，高端礼品，增速3%", priceRangeCny: null },
  { id: "cat-13", level1: "静态葡萄酒", level2: "桃红葡萄酒", level3: "干型", level4: "高端 >$25/瓶", marketVolume: 6, globalShare: 1.2, topBrands: "蝶之兰 | 米哈瓦 | 普罗旺斯名庄桃红", trend: "社交货币属性，增速8-10%", priceRangeCny: [169, Infinity] },
  { id: "cat-14", level1: "静态葡萄酒", level2: "桃红葡萄酒", level3: "干型", level4: "大众 <$25/瓶", marketVolume: 18, globalShare: 3.6, topBrands: "黄尾袋鼠桃红 | 各类桃红起泡", trend: "夏季/户外场景，增速8.6%", priceRangeCny: [0, 169] },
  { id: "cat-15", level1: "静态葡萄酒", level2: "桃红葡萄酒", level3: "半甜", level4: "全价格带", marketVolume: 6, globalShare: 1.2, topBrands: "白仙粉黛 | 甜型桃红起泡", trend: "美国/新兴市场偏好，增速5%", priceRangeCny: null },
  { id: "cat-16", level1: "起泡葡萄酒", level2: "香槟", level3: "绝干/干型", level4: "无年份 NV", marketVolume: 12, globalShare: 2.4, topBrands: "LVMH集团 | Louis Roederer | Laurent-Perrier", trend: "庆典刚需，增速4-5%", priceRangeCny: null },
  { id: "cat-17", level1: "起泡葡萄酒", level2: "香槟", level3: "半干/甜型", level4: "年份/特酿", marketVolume: 7, globalShare: 1.4, topBrands: "Dom Pérignon | Krug | Salon", trend: "投资收藏，顶级奢侈品，增速3%", priceRangeCny: null },
  { id: "cat-18", level1: "起泡葡萄酒", level2: "普罗塞克", level3: "干型/绝干", level4: "全价格带", marketVolume: 15, globalShare: 3, topBrands: "La Marca | Zonin | Ruffino", trend: "意大利平价起泡，Aperol Spritz带动，增速7%", priceRangeCny: null },
  { id: "cat-19", level1: "起泡葡萄酒", level2: "卡瓦", level3: "干型/绝干", level4: "全价格带", marketVolume: 10, globalShare: 2, topBrands: "Freixenet | Codorníu", trend: "西班牙传统法，性价比之选，增速4%", priceRangeCny: null },
  { id: "cat-20", level1: "起泡葡萄酒", level2: "其他起泡", level3: "干型/半干/甜型", level4: "细分产区", marketVolume: 16, globalShare: 3.2, topBrands: "Franciacorta | Cremant | Sekt", trend: "新兴产区崛起，增速6-8%", priceRangeCny: null },
  { id: "cat-21", level1: "加强葡萄酒", level2: "波特酒", level3: "甜型/半甜", level4: "红宝石/茶色/年份", marketVolume: 7.5, globalShare: 1.5, topBrands: "Taylor's Port | Sandeman | Graham's", trend: "葡萄牙杜罗河，餐后酒，增速2%", priceRangeCny: null },
  { id: "cat-22", level1: "加强葡萄酒", level2: "雪莉酒", level3: "干型/半干/甜型", level4: "Fino/Manzanilla/Oloroso/PX", marketVolume: 4.5, globalShare: 0.9, topBrands: "Tio Pepe | Harveys | González Byass", trend: "西班牙赫雷斯，小众复兴，增速1-2%", priceRangeCny: null },
  { id: "cat-23", level1: "加强葡萄酒", level2: "其他加强酒", level3: "干型/甜型", level4: "Vermouth/调制酒", marketVolume: 3, globalShare: 0.6, topBrands: "Martini | Cinzano | Noilly Prat", trend: "鸡尾酒基底，调酒文化带动，增速5%", priceRangeCny: null },
  { id: "cat-24", level1: "甜酒/其他", level2: "贵腐/冰酒", level3: "甜型", level4: "高端甜酒", marketVolume: 9, globalShare: 1.8, topBrands: "滴金 | 冰酒Inniskillin | 托卡伊", trend: "甜酒标杆，礼品/收藏，增速3%", priceRangeCny: null },
  { id: "cat-25", level1: "甜酒/其他", level2: "其他甜酒", level3: "甜型/半甜", level4: "晚收/风干", marketVolume: 6, globalShare: 1.2, topBrands: "晚收雷司令 | 莫斯卡托甜白 | 风干葡萄酒", trend: "入门甜酒，电商走量，增速4%", priceRangeCny: null },
  { id: "cat-26", level1: "甜酒/其他", level2: "其他（果酒/低度/RTD）", level3: "甜型/半甜", level4: "含葡萄酒基底的RTD", marketVolume: 50, globalShare: 10, topBrands: "各类果酒 | 桑格利亚 | 低度葡萄酒饮料", trend: "Z世代偏好，增速10-15%", priceRangeCny: null },
];

function priceInRange(price: number, range: [number, number]): boolean {
  const [min, max] = range;
  if (price < min) return false;
  if (max !== Infinity && price > max) return false;
  return true;
}

export function matchProductToCell(
  product: Product,
  cell: WineCategoryCell,
): boolean {
  const mapping = PRODUCT_CATEGORY_MAP[product.category];
  if (!mapping) return false;
  if (cell.level2 !== mapping.level2 || cell.level3 !== mapping.level3) {
    return false;
  }
  if (!cell.priceRangeCny) return false;
  return priceInRange(getPrimaryPrice(product), cell.priceRangeCny);
}

export function mapProductsToMatrix(
  products: ProductWithSeries[],
): MatrixCellWithProducts[] {
  return WINE_CATEGORY_MATRIX.map((cell) => {
    const matchedProducts = products
      .filter((p) => matchProductToCell(p, cell))
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: getPrimaryPrice(p),
      }));
    return { ...cell, matchedProducts };
  });
}

export function getTotalMarketVolume(): number {
  return WINE_CATEGORY_MATRIX.reduce((sum, c) => sum + c.marketVolume, 0);
}

export function getLevel1ShareData(): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const cell of WINE_CATEGORY_MATRIX) {
    map.set(cell.level1, (map.get(cell.level1) ?? 0) + cell.marketVolume);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function getPriceSegmentMarketData(
  products: ProductWithSeries[],
): PriceSegmentMarket[] {
  const segments: PriceSegmentMarket[] = [
    { label: "奢华高端", range: [500, Infinity], volume: 0, ghammerProducts: [] },
    { label: "中高端", range: [200, 500], volume: 0, ghammerProducts: [] },
    { label: "中端", range: [100, 200], volume: 0, ghammerProducts: [] },
    { label: "大众入门", range: [0, 100], volume: 0, ghammerProducts: [] },
    { label: "全价格带/其他", range: [-1, -1], volume: 0, ghammerProducts: [] },
  ];

  for (const cell of WINE_CATEGORY_MATRIX) {
    if (!cell.priceRangeCny) {
      segments[4].volume += cell.marketVolume;
      continue;
    }
    const [min] = cell.priceRangeCny;
    if (min >= 500) segments[0].volume += cell.marketVolume;
    else if (min >= 200) segments[1].volume += cell.marketVolume;
    else if (min >= 100) segments[2].volume += cell.marketVolume;
    else segments[3].volume += cell.marketVolume;
  }

  for (const product of products) {
    const price = getPrimaryPrice(product);
    const label = `${product.name} ¥${price}`;
    const seg = segments.find((s) => {
      if (s.range[0] === -1) return false;
      return price >= s.range[0] && price <= s.range[1];
    });
    if (seg && !seg.ghammerProducts.includes(label)) {
      seg.ghammerProducts.push(label);
    }
  }

  return segments;
}

export function formatCnyRange(range: [number, number] | null): string {
  if (!range) return "";
  const [min, max] = range;
  if (max === Infinity) return `¥${min}+`;
  if (min === 0) return `<¥${max}`;
  return `¥${min}-¥${max}`;
}

export function formatPriceSegmentRange(range: [number, number]): string {
  if (range[0] === -1) return "全价格带";
  const prefix = range[0] === 0 ? "<" : "¥";
  const min = range[0] === 0 ? "" : range[0];
  const max =
    range[1] === Infinity ? "+" : range[0] === 0 ? `¥${range[1]}` : `-¥${range[1]}`;
  return `${prefix}${min}${max}`;
}

export function getMatrixDisplayStats(products: ProductWithSeries[]) {
  const mapped = mapProductsToMatrix(products);
  const coveredCount = mapped.filter((c) => c.matchedProducts.length > 0).length;
  return {
    totalMarketVolume: getTotalMarketVolume(),
    subCategoryCount: WINE_CATEGORY_MATRIX.length,
    coveredCategoryCount: coveredCount,
    productCount: products.length,
  };
}
