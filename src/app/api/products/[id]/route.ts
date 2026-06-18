import { NextResponse } from "next/server";
import { z } from "zod";
import { generateId, readDb, writeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/init-db";
import type { ProductSku } from "@/lib/types";

const skuSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  salesSpec: z.string().optional().default(""),
  sortOrder: z.number().int().default(0),
  prices: z.array(
    z.object({
      channelId: z.string(),
      price: z.number().min(0),
    }),
  ),
});

const productSchema = z.object({
  name: z.string().min(1),
  seriesId: z.string().min(1),
  positioning: z.string().optional().default(""),
  category: z.string().optional().default(""),
  varietal: z.string().optional().default(""),
  wineStyle: z.string().optional().default(""),
  bottleType: z.string().optional().default(""),
  gwa: z.string().optional().default(""),
  region: z.string().optional().default(""),
  vineAge: z.string().optional().default(""),
  oakGrade: z.string().optional().default(""),
  oakAging: z.string().optional().default(""),
  alcohol: z.string().optional().default(""),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  priceSegment: z.enum(["luxury", "mid-high", "mid", "entry", ""]).optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  skus: z.array(skuSchema).optional().default([]),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await ensureDbSeeded();
  const db = await readDb();
  const product = db.products.find((p) => p.id === params.id);
  if (!product) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }
  return NextResponse.json({ product, channels: db.channels, series: db.series });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  await ensureDbSeeded();
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = await readDb();
  const index = db.products.findIndex((p) => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }

  if (!db.series.some((s) => s.id === parsed.data.seriesId)) {
    return NextResponse.json({ error: "所选系列不存在" }, { status: 400 });
  }

  const existing = db.products[index];
  const skus: ProductSku[] = parsed.data.skus.map((s, i) => ({
    id: s.id ?? generateId(),
    name: s.name,
    salesSpec: s.salesSpec ?? "",
    sortOrder: s.sortOrder ?? i,
    prices: s.prices,
  }));

  db.products[index] = {
    ...existing,
    ...parsed.data,
    skus,
    updatedAt: new Date().toISOString(),
  };

  await writeDb(db);
  return NextResponse.json({ product: db.products[index] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  await ensureDbSeeded();
  const db = await readDb();
  const index = db.products.findIndex((p) => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }

  db.products.splice(index, 1);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
