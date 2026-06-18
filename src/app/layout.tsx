import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "金锤葡萄酒 | Golden Hammer Wine",
  description:
    "金锤葡萄酒品牌官方产品展示平台，面向渠道伙伴展示系列产品特点与多渠道定价体系。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
