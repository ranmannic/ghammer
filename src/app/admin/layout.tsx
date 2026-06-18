import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="admin-shell min-h-screen bg-gray-50 text-gray-900">
      {session && (
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-semibold text-wine-900">
                金锤管理后台
              </Link>
              <nav className="flex gap-4 text-sm text-gray-600">
                <Link href="/admin/series" className="hover:text-wine-800">
                  系列管理
                </Link>
                <Link href="/admin/products" className="hover:text-wine-800">
                  产品管理
                </Link>
                <Link href="/" className="hover:text-wine-800" target="_blank">
                  查看前台
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">{session.username}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
