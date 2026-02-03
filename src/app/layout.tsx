import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "漫画LP Generator | 4コマ漫画ランディングページ自動生成",
  description: "商品情報を入力するだけで、AIが4コマ漫画形式のLPを自動生成。Nano Banana Pro & Gemini搭載。",
  keywords: ["漫画LP", "4コマ漫画", "ランディングページ", "AI生成", "Nano Banana"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
