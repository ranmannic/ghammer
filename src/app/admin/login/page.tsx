"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "登录失败");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wine-950 to-wine-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-xl font-bold text-white">
            锤
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-wine-950">金锤管理后台</h1>
          <p className="mt-1 text-sm text-gray-500">管理员登录</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-wine-800 py-2.5 font-semibold text-white hover:bg-wine-900 disabled:opacity-50"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-400">
          默认账号：admin / admin123（首次启动自动创建）
        </p>
        <p className="mt-2 text-center">
          <a href="/" className="text-sm text-gold-700 hover:underline">
            返回官网首页
          </a>
        </p>
      </div>
    </div>
  );
}
