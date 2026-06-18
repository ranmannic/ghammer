import { promises as fs } from "fs";
import path from "path";
import type {
  Channel,
  Database,
  Product,
  ProductWithSeries,
  Series,
  SeriesWithProducts,
  User,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "store.json");

const emptyDb: Database = { users: [], channels: [], series: [], products: [] };

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

function migrateDb(db: Database): Database {
  if (!db.series) db.series = [];

  for (const product of db.products as (Product & { series?: string })[]) {
    if (!product.priceSegment) product.priceSegment = "";

    if (product.seriesId) continue;
    const seriesName = product.series?.trim() || "未分类系列";
    let found = db.series.find((s) => s.name === seriesName);
    if (!found) {
      const now = new Date().toISOString();
      found = {
        id: generateId(),
        name: seriesName,
        slug: slugify(seriesName) || generateId().slice(-6),
        description: "",
        channelLabel: "",
        image: "",
        published: true,
        sortOrder: db.series.length + 1,
        createdAt: now,
        updatedAt: now,
      };
      db.series.push(found);
    }
    product.seriesId = found.id;
    delete product.series;
  }
  return db;
}

let migrationApplied = false;

export async function readDb(): Promise<Database> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    let db = JSON.parse(raw) as Database;
    const before = JSON.stringify(db.series?.length ?? 0);
    db = migrateDb(db);
    const after = JSON.stringify(db.series?.length ?? 0);
    if (!migrationApplied && before !== after) {
      await writeDb(db);
    }
    migrationApplied = true;
    return db;
  } catch {
    return structuredClone(emptyDb);
  }
}

export async function writeDb(db: Database): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export async function getPublishedProducts(): Promise<Product[]> {
  const db = await readDb();
  return db.products
    .filter((p) => p.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await readDb();
  return db.products.find((p) => p.slug === slug && p.published) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await readDb();
  return [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getChannels(): Promise<Channel[]> {
  const db = await readDb();
  return [...db.channels].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllSeries(): Promise<Series[]> {
  const db = await readDb();
  return [...db.series].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPublishedSeries(): Promise<Series[]> {
  const db = await readDb();
  return db.series
    .filter((s) => s.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSeriesById(id: string): Promise<Series | null> {
  const db = await readDb();
  return db.series.find((s) => s.id === id) ?? null;
}

export async function getSeriesWithProducts(): Promise<SeriesWithProducts[]> {
  const db = await readDb();
  const products = db.products.filter((p) => p.published);
  return db.series
    .filter((s) => s.published)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((series) => ({
      ...series,
      products: products
        .filter((p) => p.seriesId === series.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}

export async function enrichProduct(product: Product): Promise<ProductWithSeries> {
  const db = await readDb();
  const series = db.series.find((s) => s.id === product.seriesId);
  return { ...product, seriesName: series?.name ?? "未分类" };
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const db = await readDb();
  return db.users.find((u) => u.username === username) ?? null;
}

export async function countProductsInSeries(seriesId: string): Promise<number> {
  const db = await readDb();
  return db.products.filter((p) => p.seriesId === seriesId).length;
}
