import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const be = Be_Vietnam_Pro({ subsets: ["vietnamese", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-be", display: "swap" });
const jb = JetBrains_Mono({ subsets: ["vietnamese", "latin"], weight: ["600", "800"], variable: "--font-jb", display: "swap" });

export const metadata: Metadata = {
  title: "PRM Flutter · Ôn thi bằng video, flashcard và thi thử",
  description: "Học PRM (Flutter) qua video có giọng nam Việt, animation ví dụ, mẹo nhớ từ khóa, flashcard và thi thử ngẫu nhiên 50 câu.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fff9f0" };

const NAV = [
  { href: "/", label: "Trang chủ", emoji: "🏠" },
  { href: "/library/SP26_B5", label: "Video theo đợt", emoji: "🎬" },
  { href: "/flashcards", label: "Flashcard", emoji: "🗂️" },
  { href: "/exam", label: "Thi thử 50 câu", emoji: "📝" },
  { href: "/cheatsheet", label: "Mẹo từ khóa", emoji: "🔑" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${be.variable} ${jb.variable}`}>
      <body className="antialiased">
        <header className="md:sticky top-0 z-40 border-b-2 border-[#eadfcf] bg-[#fff9f0]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-[#1f2340] bg-[#fbbf24] shadow-[0_3px_0_#1f2340]">🦋</span>
              <span>PRM<span className="text-[#4f46e5]">·Flutter</span></span>
            </Link>
            <nav className="-mx-1 flex max-w-full flex-nowrap gap-1 overflow-x-auto text-[0.95rem] font-bold whitespace-nowrap" aria-label="Điều hướng chính">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-xl px-3 py-2 hover:bg-[#f1efff]">{n.emoji} {n.label}</Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 pb-16">{children}</main>
        <footer className="border-t-2 border-[#eadfcf] py-6 text-center text-sm text-[#5d6385]">
          Nội dung đề: thư mục Drive “Prm ôn thi” · Tài liệu: docs.flutter.dev, dart.dev, bloclibrary.dev · Giọng đọc: vi-VN-NamMinh · Tiến độ lưu ngay trong trình duyệt của bạn.
        </footer>
      </body>
    </html>
  );
}
