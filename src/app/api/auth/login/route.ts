import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";
import { ensureDbSeeded } from "@/lib/init-db";
import { findUserByUsername } from "@/lib/db";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  await ensureDbSeeded();
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  const user = await findUserByUsername(parsed.data.username);
  if (!user) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const token = await createSessionToken({
    userId: user.id,
    username: user.username,
  });

  const response = NextResponse.json({ ok: true, username: user.username });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
