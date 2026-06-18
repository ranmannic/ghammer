import { NextResponse } from "next/server";
import { z } from "zod";
import { generateId, readDb, slugify, writeDb } from "@/lib/db";
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

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  await ensureDbSeeded();
  const db = await readDb();
  const series = [...db.series].sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ series });
}

export async function POST(request: Request) {
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
  const now = new Date().toISOString();
  let slug = slugify(parsed.data.name);
  if (db.series.some((s) => s.slug === slug)) {
    slug = `${slug}-${generateId().slice(-4)}`;
  }

  const item = {
    id: generateId(),
    slug,
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  };

  db.series.push(item);
  await writeDb(db);
  return NextResponse.json({ series: item }, { status: 201 });
}
