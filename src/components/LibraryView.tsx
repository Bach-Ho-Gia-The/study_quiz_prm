"use client";
import Link from "next/link";
import { useState } from "react";
import { SETS, TOPICS, setQuestions } from "@/lib/data";
import { actions, useHydrated, useProgress } from "@/lib/store";

const FILTERS = [["all", "Tất cả"], ["new", "Chưa học"], ["wrong", "Hay sai"], ["done", "Đã thuộc"], ["flag", "Đánh dấu"]] as const;

export default function LibraryView({ setKey }: { setKey: string }) {
  const p = useProgress();
  const ready = useHydrated();
  const [f, setF] = useState<(typeof FILTERS)[number][0]>("all");
  const [s, setS] = useState("");
  const meta = SETS.find((x) => x.key === setKey)!;
  const all = setQuestions(setKey);
  const list = all.filter((q) => {
    if (s && !(q.q + " " + q.vi.q).toLowerCase().includes(s.toLowerCase())) return false;
    if (f === "new") return !p.mastered[q.id] && !p.wrong[q.id];
    if (f === "wrong") return !!p.wrong[q.id];
    if (f === "done") return !!p.mastered[q.id];
    if (f === "flag") return !!p.flagged[q.id];
    return true;
  });
  const order = all.map((q) => q.id);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Chọn đợt thi">
        {SETS.map((x) => (
          <Link key={x.key} href={`/library/${x.key}`} className={`btn btn-sm ${x.key === setKey ? "btn-primary" : ""}`}>{x.emoji} {x.title}</Link>
        ))}
      </div>
      <div className="card mb-5 flex flex-wrap items-center gap-4 p-5">
        <span className="grid h-16 w-16 place-items-center rounded-2xl text-4xl" style={{ background: meta.color + "22" }}>{meta.emoji}</span>
        <div className="min-w-[200px] flex-1"><h1 className="text-3xl font-extrabold">{meta.title}</h1><p className="font-semibold text-[#5d6385]">{meta.sub} · {all.length} câu</p></div>
        <Link className="btn btn-coral" href={`/watch/${order[0]}?set=${setKey}`}>▶ Xem cả đợt liên tục</Link>
        <Link className="btn btn-primary" href={`/exam?scope=${setKey}`}>📝 Thi thử đợt này</Link>
        <button className="btn btn-sm" onClick={() => { if (confirm("Bỏ trạng thái thuộc/sai của tất cả câu trong đợt này?")) actions.clearStatus(all.map((q) => q.id)); }}>↺ Đặt lại đợt</button>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map(([k, l]) => <button key={k} onClick={() => setF(k)} className={`btn btn-sm ${f === k ? "btn-sun" : ""}`} aria-pressed={f === k}>{l}</button>)}
        <input value={s} onChange={(e) => setS(e.target.value)} placeholder="🔎 Tìm câu hỏi…" aria-label="Tìm câu hỏi" className="min-h-[44px] flex-1 rounded-xl border-2 border-[#eadfcf] bg-white px-4 font-semibold" />
      </div>
      <ul className="grid gap-3">
        {list.map((q) => {
          const t = TOPICS[q.vis];
          const m = ready && p.mastered[q.id], w = ready && p.wrong[q.id];
          return (
            <li key={q.id} className="card flex flex-wrap items-center gap-3 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: t.color + "22" }} title={t.label}>{t.emoji}</span>
              <div className="min-w-[220px] flex-1">
                <div className="text-lg font-extrabold leading-snug">{q.q}</div>
                <div className="font-semibold text-[#4f46e5]">{q.vi.q}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="chip" style={{ color: t.color }}>{t.label}</span>
                  {m ? <span className="chip text-[#16a34a]">✓ Đã thuộc</span> : w ? <span className="chip text-[#e11d48]">✗ Sai {w} lần</span> : <span className="chip text-[#5d6385]">Chưa học</span>}
                  {ready && p.flagged[q.id] && <span className="chip text-[#d97706]">★ Đánh dấu</span>}
                  {ready && p.watched[q.id] && <span className="chip text-[#4f46e5]">👁 Đã xem</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="btn btn-sm btn-coral" href={`/watch/${q.id}?set=${setKey}`}>▶ Xem</Link>
                <button className="btn btn-sm" onClick={() => actions.toggle("mastered", q.id)} aria-pressed={!!m}>{m ? "Bỏ thuộc" : "✓ Thuộc"}</button>
                {w ? <button className="btn btn-sm" onClick={() => actions.set("wrong", q.id, false)}>Bỏ đánh dấu sai</button> : null}
                <button className="btn btn-sm" onClick={() => actions.toggle("flagged", q.id)} aria-pressed={!!p.flagged[q.id]} aria-label="Đánh dấu">{p.flagged[q.id] ? "★" : "☆"}</button>
              </div>
            </li>
          );
        })}
        {!list.length && <li className="card p-8 text-center font-bold text-[#5d6385]">Không có câu nào khớp bộ lọc.</li>}
      </ul>
    </div>
  );
}
