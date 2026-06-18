export type ChannelCode = "jd" | "tmall" | "pdd" | "douyin" | "meituan";

export type PriceSegment = "luxury" | "mid-high" | "mid" | "entry";

export interface Channel {
  id: string;
  name: string;
  code: ChannelCode;
  sortOrder: number;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string;
  channelLabel: string;
  image: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkuChannelPrice {
  channelId: string;
  price: number;
}

export interface ProductSku {
  id: string;
  name: string;
  salesSpec: string;
  sortOrder: number;
  prices: SkuChannelPrice[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  seriesId: string;
  positioning: string;
  category: string;
  varietal: string;
  wineStyle: string;
  bottleType: string;
  gwa: string;
  region: string;
  vineAge: string;
  oakGrade: string;
  oakAging: string;
  alcohol: string;
  description: string;
  image: string;
  priceSegment: PriceSegment | "";
  featured: boolean;
  published: boolean;
  sortOrder: number;
  skus: ProductSku[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: "admin";
  createdAt: string;
}

export interface Database {
  users: User[];
  channels: Channel[];
  series: Series[];
  products: Product[];
}

export type ProductWithSeries = Product & { seriesName: string };

export type SeriesWithProducts = Series & { products: Product[] };
