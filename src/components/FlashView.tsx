"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LETTERS, QUESTIONS, SETS, TOPICS, shuffle } from "@/lib/data";
import { actions, useHydrated, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sfx";

export default function FlashView() {
  const p = useProgress();
  const ready = useHydrated();
  const [scope, setScope] = useState("all");
  const [mode, setMode] = useState<"all" | "unknown" | "wrong" | "flag">("all");
  const [topic, setTopic] = useState("all");
  const [seed, setSeed] = useState(0);
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);

  const deck = useMemo(() => {
    let l = QUESTIONS.filter((q) => (scope === "all" || q.sets.includes(scope)) && (topic === "all" || q.vis === topic));
    if (mode === "unknown") l = l.filter((q) => !p.known[q.id]);
    if (mode === "wrong") l = l.filter((q) => p.wrong[q.id]);
    if (mode === "flag") l = l.filter((q) => p.flagged[q.id]);
    return seed ? shuffle(l) : l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, mode, topic, seed, ready]);
  const card = deck[Math.min(pos, deck.length - 1)];
  const go = (d: number) => { setFlip(false); setPos((x) => Math.max(0, Math.min(deck.length - 1, x + d))); };
  const mark = (ok: boolean) => { if (!card) return; actions.set("known", card.id, ok); if (!ok) actions.set("wrong", card.id, true); ok ? sfx.ding() : sfx.wrong(); setTimeout(() => go(1), 250); };

  useEffect(() => { setPos(0); setFlip(false); }, [scope, mode, topic, seed]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); setFlip((f) => !f); }
      if (e.code === "ArrowRight") go(1);
      if (e.code === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const t = card && TOPICS[card.vis];
  const sel = "min-h-[44px] rounded-xl border-2 border-[#eadfcf] bg-white px-3 font-bold";
  return (
    <div>
      <h1 className="text-3xl font-extrabold md:text-4xl">🗂️ Flashcard</h1>
      <p className="mt-1 text-[#5d6385]">Nhìn câu hỏi, tự nhớ đáp án rồi lật thẻ. Bấm “Đã thuộc” hoặc “Chưa thuộc” để máy ghi nhớ.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <select className={sel} value={scope} onChange={(e) => setScope(e.target.value)} aria-label="Chọn đợt"><option value="all">Tất cả các đợt</option>{SETS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}</select>
        <select className={sel} value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Chọn chủ đề"><option value="all">Mọi chủ đề</option>{Object.entries(TOPICS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}</select>
        <select className={sel} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label="Lọc trạng thái"><option value="all">Tất cả thẻ</option><option value="unknown">Chưa thuộc</option><option value="wrong">Hay sai</option><option value="flag">Đã đánh dấu</option></select>
        <button className="btn btn-sm btn-sun" onClick={() => setSeed((s) => s + 1)}>🔀 Xáo thẻ</button>
        <button className="btn btn-sm" onClick={() => { actions.clearStatus([]); if (confirm("Bỏ check tất cả thẻ đã thuộc?")) QUESTIONS.forEach((q) => actions.set("known", q.id, false)); }}>↺ Bỏ check thẻ</button>
      </div>

      {!card ? (
        <div className="card mt-8 p-10 text-center"><div className="text-5xl">🎉</div><p className="mt-3 text-xl font-extrabold">Không có thẻ nào ở bộ lọc này.</p><button className="btn btn-primary mt-4" onClick={() => { setMode("all"); setScope("all"); setTopic("all"); }}>Xem tất cả thẻ</button></div>
      ) : (
        <>
          <div className="mt-4 flex items-center gap-3 font-bold">
            <span>Thẻ {pos + 1} / {deck.length}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#efe7d8]"><div className="h-full rounded-full bg-[#4f46e5] transition-all" style={{ width: `${((pos + 1) / deck.length) * 100}%` }} /></div>
            <span className="text-[#16a34a]">{ready ? deck.filter((q) => p.known[q.id]).length : 0} thuộc</span>
          </div>
          <div className="flip-scene mt-4">
            <div className={`flip-card ${flip ? "flipped" : ""} h-[32rem] sm:h-[29rem]`} onClick={() => setFlip(!flip)} role="button" tabIndex={0} aria-label="Lật thẻ" onKeyDown={() => {}}>
              <div className="flip-face card p-5 sm:p-7">
                <div className="flex items-center gap-2"><span className="chip" style={{ color: t?.color }}>{t?.emoji} {t?.label}</span>{ready && p.known[card.id] && <span className="chip text-[#16a34a]">✓ thuộc</span>}{ready && p.wrong[card.id] && <span className="chip text-[#e11d48]">✗ hay sai</span>}</div>
                <div className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">{card.q}</div>
                <div className="mt-1 text-lg font-semibold text-[#4f46e5]">{card.vi.q}</div>
                <div className="mt-4 grid gap-2">{LETTERS.map((l) => <div key={l} className="flex gap-3 rounded-xl border-2 border-[#eadfcf] px-3 py-2 text-lg font-bold"><span className="text-[#4f46e5]">{l}.</span>{card.o[l]}</div>)}</div>
                <div className="mt-3 text-center text-sm font-bold text-[#5d6385]">👆 Chạm hoặc nhấn Space để lật</div>
              </div>
              <div className="flip-face flip-back card p-5 sm:p-7" style={{ background: "#f0fdf4" }}>
                <div className="text-sm font-bold text-[#15803d]">ĐÁP ÁN</div>
                <div className="mt-1 text-3xl font-extrabold text-[#15803d]">{card.a}. {card.o[card.a]}</div>
                <p className="mt-3 text-lg leading-relaxed">{card.why}</p>
                <div className="mt-3 rounded-2xl bg-[#fff7d6] p-3 text-lg font-bold">🔑 {card.tip}</div>
                <div className="mt-3 flex flex-wrap gap-2">{card.kw.map(([k, m]) => <span key={k} className="chip text-[#b45309]" title={m}>{k} = {m}</span>)}</div>
                <Link href={`/watch/${card.id}`} onClick={(e) => e.stopPropagation()} className="btn btn-sm btn-coral mt-4">▶ Xem video câu này</Link>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button className="btn" onClick={() => go(-1)} disabled={pos === 0}>← Trước</button>
            <button className="btn btn-coral" onClick={() => mark(false)}>✗ Chưa thuộc</button>
            <button className="btn btn-green" onClick={() => mark(true)}>✓ Đã thuộc</button>
            <button className="btn" onClick={() => actions.toggle("flagged", card.id)}>{p.flagged[card.id] ? "★" : "☆"} Đánh dấu</button>
            <button className="btn" onClick={() => go(1)} disabled={pos >= deck.length - 1}>Sau →</button>
          </div>
        </>
      )}
    </div>
  );
}
