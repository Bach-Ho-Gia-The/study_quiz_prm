"use client";
import Link from "next/link";
import { QUESTIONS, SETS, TOPICS, BY_ID, setQuestions } from "@/lib/data";
import { actions, useHydrated, useProgress } from "@/lib/store";

export default function HomeView() {
  const p = useProgress();
  const ready = useHydrated();
  const total = QUESTIONS.length;
  const mastered = Object.keys(p.mastered).length;
  const wrong = Object.keys(p.wrong).length;
  const watched = Object.keys(p.watched).length;
  const last = p.last && BY_ID[p.last];
  const stats = [
    { label: "Đã thuộc", v: mastered, c: "#16a34a", e: "✅" },
    { label: "Hay sai", v: wrong, c: "#e11d48", e: "🔁" },
    { label: "Đã xem video", v: watched, c: "#4f46e5", e: "🎬" },
    { label: "Câu duy nhất", v: total, c: "#f59e0b", e: "📚" },
  ];
  return (
    <div className="space-y-10">
      <section className="card relative overflow-hidden p-6 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#fde68a] opacity-70" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-[#c7d2fe] opacity-70" />
        <div className="relative max-w-3xl">
          <span className="chip text-[#4f46e5]">🎙️ Giọng nam Nam Minh · {total} video · không lặp câu</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Học thi PRM <span className="text-[#4f46e5]">Flutter</span> bằng video, <span className="text-[#ff6b4a]">hiểu tận gốc</span></h1>
          <p className="mt-4 text-lg leading-relaxed text-[#3b4065] md:text-xl">Mỗi câu trắc nghiệm là một video ngắn: đọc đề, soi từ khóa, ví dụ động, loại từng đáp án, chốt đáp án và mẹo nhớ. Ít chữ, nhiều hình, nói bằng tiếng Việt dễ hiểu.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={last ? `/watch/${last.id}` : "/watch/q001"} className="btn btn-coral text-lg">▶ {last ? `Xem tiếp câu ${last.n}` : "Xem video đầu tiên"}</Link>
            <Link href="/exam" className="btn btn-primary text-lg">📝 Thi thử 50 câu</Link>
            <Link href="/flashcards" className="btn text-lg">🗂️ Flashcard</Link>
          </div>
        </div>
      </section>

      <section aria-label="Tiến độ" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl">{s.e}</div>
            <div className="mt-1 text-4xl font-extrabold" style={{ color: s.c }}>{ready ? s.v : "–"}</div>
            <div className="font-bold text-[#5d6385]">{s.label}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-1 text-3xl font-extrabold">📁 Các đợt thi</h2>
        <p className="mb-4 text-[#5d6385]">Chia folder theo đúng Drive. Câu trùng giữa các đợt dùng chung một video, không phải xem lại.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SETS.map((s) => {
            const qs = setQuestions(s.key);
            const m = qs.filter((q) => p.mastered[q.id]).length;
            const w = qs.filter((q) => p.wrong[q.id]).length;
            return (
              <Link key={s.key} href={`/library/${s.key}`} className="card block p-5 transition hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: s.color + "22" }}>{s.emoji}</span>
                  <div><div className="text-xl font-extrabold">{s.title}</div><div className="text-sm font-semibold text-[#5d6385]">{s.sub}</div></div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm font-bold"><span>{qs.length} câu</span><span style={{ color: "#16a34a" }}>{ready ? m : 0} thuộc</span><span style={{ color: "#e11d48" }}>{ready ? w : 0} sai</span></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#efe7d8]"><div className="h-full rounded-full" style={{ width: `${ready ? (m / qs.length) * 100 : 0}%`, background: s.color, transition: "width .6s" }} /></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-3xl font-extrabold">🧩 Chủ đề trong đề</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TOPICS).map(([k, t]) => {
            const n = QUESTIONS.filter((q) => q.vis === k).length;
            return <Link key={k} href={`/cheatsheet#${k}`} className="chip !text-base !px-4 !py-2" style={{ color: t.color, background: "#fff" }}>{t.emoji} {t.label} · {n}</Link>;
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["🎬", "Video có animation", "Mỗi câu ~90 giây: từ khóa được tô sáng, ví dụ động, loại từng đáp án, mẹo nhớ."],
          ["📝", "Thi thử như thật", "Random 50 câu, đạt rồi thì không lặp lại. Câu sai được đánh dấu để quay lại ôn."],
          ["💾", "Lưu trong trình duyệt", "Tiến độ, câu sai, câu đánh dấu đều lưu trên máy bạn. Có thể bỏ check hoặc đặt lại bất cứ lúc nào."],
        ].map(([e, t, d]) => (
          <div key={t} className="card p-5"><div className="text-3xl">{e}</div><div className="mt-2 text-xl font-extrabold">{t}</div><p className="mt-1 leading-relaxed text-[#3b4065]">{d}</p></div>
        ))}
      </section>
      <div className="text-center"><button className="btn btn-sm" onClick={() => { if (confirm("Xóa toàn bộ tiến độ trên trình duyệt này?")) actions.resetAll(); }}>↺ Đặt lại toàn bộ tiến độ</button></div>
    </div>
  );
}
