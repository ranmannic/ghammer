import { NextResponse } from "next/server";
import { z } from "zod";
import { readDb, writeDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/init-db";

const seriesSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  channelLabel: z.string().optional().default(""),
  image: z.string().optional().default(""),
  published: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
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
  const series = db.series.find((s) => s.id === params.id);
  if (!series) {
    return NextResponse.json({ error: "系列不存在" }, { status: 404 });
  }
  const products = db.products.filter((p) => p.seriesId === series.id);
  return NextResponse.json({ series, products });
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
  const parsed = seriesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const db = await readDb();
  const index = db.series.findIndex((s) => s.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "系列不存在" }, { status: 404 });
  }

  db.series[index] = {
    ...db.series[index],
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return NextResponse.json({ series: db.series[index] });
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
  const index = db.series.findIndex((s) => s.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: "系列不存在" }, { status: 404 });
  }

  const linked = db.products.filter((p) => p.seriesId === params.id);
  if (linked.length > 0) {
    return NextResponse.json(
      { error: `该系列下仍有 ${linked.length} 款产品，请先移动或删除产品` },
      { status: 400 },
    );
  }

  db.series.splice(index, 1);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
