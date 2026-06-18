"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-gray-600 hover:text-red-600"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      退出登录
    </button>
  );
}
