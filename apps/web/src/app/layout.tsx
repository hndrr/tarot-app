import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
// GoogleTagManager は dynamic import するため、通常の import は削除
import "./globals.css";

// GoogleTagManagerを動的にインポートし、SSRを無効にする
const DynamicGoogleTagManager = dynamic(
  () =>
    import("@next/third-parties/google").then((mod) => mod.GoogleTagManager),
  { ssr: false }
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAROTIE",
  description: "タロットカードに隠されたメッセージを見つけましょう。",
  openGraph: {
    title: "TAROTIE",
    description: "タロットカードに隠されたメッセージを見つけましょう。",
    images: [
      {
        url: "ogp.jpg",
        width: 1200,
        height: 630,
        alt: "TAROTIE",
      },
    ],
  },
};

const GTM_ID = process.env.GTM_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* GTM_IDが存在する場合のみ、動的にインポートしたコンポーネントをレンダリング */}
      {GTM_ID && <DynamicGoogleTagManager gtmId={GTM_ID} />}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
