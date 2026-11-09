import raw from "@/data/questions.json";

export type Letter = "A" | "B" | "C" | "D";
export type Question = {
  id: string;
  n: number;
  q: string;
  o: Record<Letter, string>;
  a: Letter;
  sets: string[];
  src: string[];
  vi: { q: string; o: string[] };
  kw: [string, string][];
  ex: string;
  wrong: Partial<Record<Letter, string>>;
  why: string;
  tip: string;
  deep: [string, string];
  vis: string;
};

export const QUESTIONS = raw as unknown as Question[];
export const BY_ID: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const LETTERS: Letter[] = ["A", "B", "C", "D"];

export const SETS = [
  { key: "SP26_B5", title: "Prm_SP26_B5", sub: "Spring 2026 · Bài kiểm tra B5", emoji: "🌱", color: "#0ea5a0" },
  { key: "SP26_Final", title: "Prm_SP26_Final", sub: "Spring 2026 · Thi cuối kỳ", emoji: "🏁", color: "#4f46e5" },
  { key: "SU26_B5", title: "Prm_SU26_B5", sub: "Summer 2026 · Bài kiểm tra B5", emoji: "☀️", color: "#f59e0b" },
  { key: "SU26_Final", title: "Prm_SU26_Final", sub: "Summer 2026 · Thi cuối kỳ", emoji: "🎯", color: "#e11d48" },
  { key: "SU26_Retake", title: "Prm_SU26_Retake", sub: "Summer 2026 · Thi lại", emoji: "🔁", color: "#7c3aed" },
] as const;

export const TOPICS: Record<string, { label: string; emoji: string; color: string; url: string; site: string }> = {
  tree: { label: "Widget & cây widget", emoji: "🌳", color: "#16a34a", url: "https://docs.flutter.dev/get-started/fundamentals/widgets", site: "docs.flutter.dev" },
  rebuild: { label: "State & dựng lại", emoji: "🔄", color: "#f97316", url: "https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app", site: "docs.flutter.dev" },
  stream: { label: "BLoC & Stream", emoji: "🚰", color: "#0284c7", url: "https://bloclibrary.dev/", site: "bloclibrary.dev" },
  layout: { label: "Bố cục", emoji: "📐", color: "#7c3aed", url: "https://docs.flutter.dev/ui/layout", site: "docs.flutter.dev" },
  scroll: { label: "Cuộn & Sliver", emoji: "📜", color: "#db2777", url: "https://docs.flutter.dev/ui/layout/scrolling/slivers", site: "docs.flutter.dev" },
  storage: { label: "Lưu trữ", emoji: "🗄️", color: "#b45309", url: "https://docs.flutter.dev/cookbook/persistence", site: "docs.flutter.dev" },
  http: { label: "Mạng & HTTP", emoji: "🌐", color: "#0d9488", url: "https://docs.flutter.dev/cookbook/networking/fetch-data", site: "docs.flutter.dev" },
  auth: { label: "Đăng nhập & bảo mật", emoji: "🔐", color: "#be123c", url: "https://firebase.google.com/docs/auth/flutter/start", site: "firebase.google.com" },
  test: { label: "Kiểm thử", emoji: "🧪", color: "#65a30d", url: "https://docs.flutter.dev/testing/overview", site: "docs.flutter.dev" },
  anim: { label: "Hiệu ứng", emoji: "🎬", color: "#c026d3", url: "https://docs.flutter.dev/ui/animations", site: "docs.flutter.dev" },
  nav: { label: "Điều hướng", emoji: "🧭", color: "#2563eb", url: "https://docs.flutter.dev/ui/navigation", site: "docs.flutter.dev" },
  form: { label: "Form & giao diện", emoji: "📝", color: "#ea580c", url: "https://docs.flutter.dev/cookbook/forms", site: "docs.flutter.dev" },
  arch: { label: "Kiến trúc", emoji: "🏛️", color: "#475569", url: "https://docs.flutter.dev/app-architecture", site: "docs.flutter.dev" },
  dart: { label: "Ngôn ngữ Dart", emoji: "🎯", color: "#0891b2", url: "https://dart.dev/language", site: "dart.dev" },
  tools: { label: "Công cụ", emoji: "🛠️", color: "#4f46e5", url: "https://docs.flutter.dev/tools/devtools", site: "docs.flutter.dev" },
  perf: { label: "Hiệu năng", emoji: "⚡", color: "#ca8a04", url: "https://docs.flutter.dev/perf", site: "docs.flutter.dev" },
};

export function setQuestions(key: string) {
  return QUESTIONS.filter((q) => q.sets.includes(key));
}
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
