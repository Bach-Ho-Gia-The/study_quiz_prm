"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BY_ID, LETTERS, QUESTIONS, SETS, TOPICS, shuffle, type Letter } from "@/lib/data";
import { actions, useHydrated, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sfx";

type Run = { ids: string[]; ans: Record<string, Letter>; flags: Record<string, 1>; started: number; secs: number; scope: string; done?: boolean };
const KEY = "prm-exam-v1";
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function ExamView({ initialScope }: { initialScope?: string }) {
  const p = useProgress();
  const ready = useHydrated();
  const [scope, setScope] = useState(initialScope && SETS.some((s) => s.key === initialScope) ? initialScope : "all");
  const [size, setSize] = useState(50);
  const [again, setAgain] = useState(false);
  const [vi, setVi] = useState(true);
  const [run, setRun] = useState<Run | null>(null);
  const [cur, setCur] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [snap, setSnap] = useState<Record<string, boolean> | null>(null);

  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setRun(JSON.parse(s)); } catch {} }, []);
  const save = useCallback((r: Run | null) => { setRun(r); try { r ? localStorage.setItem(KEY, JSON.stringify(r)) : localStorage.removeItem(KEY); } catch {} }, []);

  const pool = useMemo(() => QUESTIONS.filter((q) => scope === "all" || q.sets.includes(scope)), [scope]);
  const mastered = pool.filter((q) => ready && p.mastered[q.id]);
  const wrongs = pool.filter((q) => ready && p.wrong[q.id] && !p.mastered[q.id]);
  const fresh = pool.filter((q) => !(ready && (p.mastered[q.id] || p.wrong[q.id])));
  const avail = again ? pool.length : pool.length - mastered.length;

  const start = () => {
    const w = shuffle(wrongs.map((q) => q.id));
    const f = shuffle(fresh.map((q) => q.id));
    const m = again ? shuffle(mastered.map((q) => q.id)) : [];
    const n = Math.min(size, avail);
    const take = w.slice(0, Math.min(w.length, Math.ceil(n / 2)));
    const rest = [...f, ...w.slice(take.length), ...m].slice(0, n - take.length);
    const ids = shuffle([...take, ...rest]);
    sfx.unlock();
    save({ ids, ans: {}, flags: {}, started: Date.now(), secs: ids.length * 60, scope });
    setCur(0); setSnap(null);
  };
  const submit = useCallback((r: Run) => {
    const res = r.ids.map((id) => ({ id, ok: r.ans[id] === BY_ID[id].a }));
    actions.finishExam(res, r.scope);
    setSnap(Object.fromEntries(res.map((x) => [x.id, x.ok])));
    save({ ...r, done: true });
    const ok = res.filter((x) => x.ok).length;
    ok === res.length ? sfx.cheer() : ok / res.length >= 0.5 ? sfx.ding() : sfx.wrong();
  }, [save]);

  const running = !!run && !run.done;
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [running]);
  const left = run ? Math.max(0, run.secs - Math.floor((now - run.started) / 1000)) : 0;
  useEffect(() => { if (running && run && left === 0) submit(run); }, [left, running, run, submit]);

  const sel = "min-h-[44px] rounded-xl border-2 border-[#eadfcf] bg-white px-3 font-bold";

  /* ===== Kết quả ===== */
  if (run?.done) {
    const res = run.ids.map((id) => ({ q: BY_ID[id], mine: run.ans[id], ok: run.ans[id] === BY_ID[id].a }));
    const score = res.filter((r) => r.ok).length;
    const pct = Math.round((score / res.length) * 100);
    return (
      <div>
        <div className="card p-6 text-center md:p-10">
          <div className="text-6xl">{pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
          <h1 className="mt-2 text-4xl font-extrabold">{score} / {res.length} câu đúng · {pct}%</h1>
          <p className="mt-2 text-lg text-[#3b4065]">{pct === 100 ? "Tuyệt vời! Toàn bộ câu này sẽ không xuất hiện lại ở lần thi sau." : `Các câu đúng đã được ghi nhớ và sẽ không lặp lại. ${res.length - score} câu sai được đánh dấu để xuất hiện lại.`}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3"><button className="btn btn-primary" onClick={() => { save(null); }}>📝 Thi tiếp</button><Link href="/flashcards" className="btn">🗂️ Ôn flashcard</Link><Link href="/" className="btn">🏠 Trang chủ</Link></div>
        </div>
        <h2 className="mb-3 mt-8 text-2xl font-extrabold">Xem lại từng câu</h2>
        <ul className="grid gap-3">
          {res.map((r, i) => (
            <li key={r.q.id} className="card p-4" style={{ borderColor: r.ok ? "#bbf7d0" : "#fecdd3" }}>
              <div className="flex flex-wrap items-start gap-2"><span className={`chip ${r.ok ? "text-[#16a34a]" : "text-[#e11d48]"}`}>{r.ok ? "✓ Đúng" : "✗ Sai"} · Câu {i + 1}</span><span className="text-sm font-bold text-[#5d6385]">{TOPICS[r.q.vis].emoji} {TOPICS[r.q.vis].label}</span></div>
              <div className="mt-2 text-lg font-extrabold">{r.q.q}</div>
              <div className="font-semibold text-[#4f46e5]">{r.q.vi.q}</div>
              <div className="mt-2 grid gap-1 text-[1rem]">
                {r.mine && !r.ok && <div className="text-[#e11d48]">Bạn chọn: <b>{r.mine}. {r.q.o[r.mine]}</b> — {r.q.wrong[r.mine]}</div>}
                {!r.mine && <div className="text-[#e11d48]">Bạn chưa trả lời.</div>}
                <div className="text-[#15803d]">Đáp án: <b>{r.q.a}. {r.q.o[r.q.a]}</b> — {r.q.why}</div>
                <div className="rounded-xl bg-[#fff7d6] p-2 font-semibold">🔑 {r.q.tip}</div>
              </div>
              <div className="mt-3 flex gap-2"><Link href={`/watch/${r.q.id}`} className="btn btn-sm btn-coral">▶ Xem video</Link><button className="btn btn-sm" onClick={() => actions.toggle("flagged", r.q.id)}>{p.flagged[r.q.id] ? "★ Đã đánh dấu" : "☆ Đánh dấu"}</button></div>
            </li>
          ))}
        </ul>
        <div className="hidden">{snap ? "" : ""}</div>
      </div>
    );
  }

  /* ===== Đang thi ===== */
  if (run && running) {
    const q = BY_ID[run.ids[cur]];
    const answered = Object.keys(run.ans).length;
    const pick = (l: Letter) => { sfx.click(); save({ ...run, ans: { ...run.ans, [q.id]: l } }); };
    return (
      <div>
        <div className="card sticky top-[64px] z-30 mb-4 flex flex-wrap items-center gap-3 p-3">
          <span className="font-extrabold">Câu {cur + 1}/{run.ids.length}</span>
          <span className="chip text-[#4f46e5]">Đã làm {answered}</span>
          <span className={`mono ml-auto text-2xl font-extrabold ${left < 300 ? "text-[#e11d48]" : ""}`}>⏱ {fmt(left)}</span>
          <button className="btn btn-sm btn-coral" onClick={() => { const miss = run.ids.length - answered; if (!miss || confirm(`Còn ${miss} câu chưa làm. Vẫn nộp bài?`)) submit(run); }}>Nộp bài</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
          <div className="card p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2"><span className="chip text-[#4f46e5]">Chọn 1 đáp án</span><button className={`btn btn-sm ml-auto ${run.flags[q.id] ? "btn-sun" : ""}`} onClick={() => { const f = { ...run.flags }; if (f[q.id]) delete f[q.id]; else f[q.id] = 1; save({ ...run, flags: f }); }}>{run.flags[q.id] ? "🚩 Đã gắn cờ" : "⚑ Gắn cờ xem lại"}</button></div>
            <h1 className="mt-3 text-2xl font-extrabold leading-snug md:text-3xl">{q.q}</h1>
            {vi && <p className="mt-1 text-lg font-semibold text-[#4f46e5]">{q.vi.q}</p>}
            <div className="mt-5 grid gap-3" role="radiogroup" aria-label="Đáp án">
              {LETTERS.map((l, i) => {
                const on = run.ans[q.id] === l;
                return (
                  <button key={l} role="radio" aria-checked={on} onClick={() => pick(l)} className="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition" style={{ borderColor: on ? "#4f46e5" : "#eadfcf", background: on ? "#eef2ff" : "#fff", boxShadow: on ? "0 0 0 4px #c7d2fe" : "none" }}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-extrabold" style={{ background: on ? "#4f46e5" : "#efeaff", color: on ? "#fff" : "#4f46e5" }}>{l}</span>
                    <span><span className="block text-lg font-bold">{q.o[l]}</span>{vi && q.vi.o[i].toLowerCase() !== q.o[l].toLowerCase() && <span className="block text-sm text-[#5d6385]">{q.vi.o[i]}</span>}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3"><button className="btn" disabled={cur === 0} onClick={() => setCur(cur - 1)}>← Câu trước</button><button className="btn btn-primary" disabled={cur === run.ids.length - 1} onClick={() => setCur(cur + 1)}>Câu sau →</button><label className="ml-auto flex items-center gap-2 font-bold"><input type="checkbox" checked={vi} onChange={(e) => setVi(e.target.checked)} className="h-5 w-5" /> Hiện tiếng Việt</label></div>
          </div>
          <aside className="card h-fit p-4" aria-label="Bảng câu hỏi">
            <div className="mb-2 font-extrabold">Bảng câu hỏi</div>
            <div className="grid grid-cols-5 gap-2">
              {run.ids.map((id, i) => (
                <button key={id} onClick={() => setCur(i)} aria-label={`Câu ${i + 1}`} className="relative grid h-10 place-items-center rounded-lg border-2 text-sm font-extrabold" style={{ borderColor: i === cur ? "#1f2340" : "#eadfcf", background: run.ans[id] ? "#c7d2fe" : "#fff" }}>{i + 1}{run.flags[id] && <span className="absolute -right-1 -top-2 text-xs">🚩</span>}</button>
              ))}
            </div>
            <div className="mt-3 text-xs font-bold text-[#5d6385]">Xanh tím = đã làm · 🚩 = gắn cờ</div>
          </aside>
        </div>
      </div>
    );
  }

  /* ===== Thiết lập ===== */
  return (
    <div>
      <h1 className="text-3xl font-extrabold md:text-4xl">📝 Thi thử như thật</h1>
      <p className="mt-1 max-w-3xl text-[#5d6385]">Random tối đa 50 câu, không trùng nhau. Làm đúng thì câu đó được ghi nhớ và không xuất hiện lại. Làm sai thì được đánh dấu và có thể quay lại. Có thể bỏ check hoặc đặt lại ở trang từng đợt.</p>
      <div className="card mt-5 grid gap-5 p-5 md:grid-cols-2 md:p-7">
        <div className="space-y-4">
          <label className="block font-bold">Phạm vi<select className={`${sel} mt-1 w-full`} value={scope} onChange={(e) => setScope(e.target.value)}><option value="all">Tất cả các đợt ({QUESTIONS.length} câu)</option>{SETS.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}</select></label>
          <label className="block font-bold">Số câu<select className={`${sel} mt-1 w-full`} value={size} onChange={(e) => setSize(+e.target.value)}>{[10, 20, 30, 40, 50].map((n) => <option key={n} value={n}>{n} câu · {n} phút</option>)}</select></label>
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" className="h-5 w-5" checked={again} onChange={(e) => setAgain(e.target.checked)} /> Cho phép cả câu đã thuộc (ôn lại)</label>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[["Chưa làm", fresh.length, "#4f46e5"], ["Hay sai", wrongs.length, "#e11d48"], ["Đã thuộc", mastered.length, "#16a34a"]].map(([l, v, c]) => <div key={l as string} className="rounded-2xl border-2 border-[#eadfcf] p-3"><div className="text-3xl font-extrabold" style={{ color: c as string }}>{v}</div><div className="text-sm font-bold text-[#5d6385]">{l}</div></div>)}
          <div className="col-span-3 text-left text-sm font-semibold text-[#5d6385]">Đề sẽ gồm khoảng một nửa câu từng sai (nếu có), còn lại là câu mới.</div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {avail > 0 ? <button className="btn btn-coral text-lg" onClick={start}>▶ Bắt đầu thi ({Math.min(size, avail)} câu)</button> : <div className="card flex flex-wrap items-center gap-3 p-5"><span className="text-3xl">🏆</span><b className="text-lg">Bạn đã thuộc hết phạm vi này!</b><button className="btn btn-sm" onClick={() => setAgain(true)}>Ôn lại câu đã thuộc</button><button className="btn btn-sm" onClick={() => actions.clearStatus(pool.map((q) => q.id))}>↺ Đặt lại phạm vi</button></div>}
        {run && !run.done ? null : null}
      </div>
      {ready && p.exams.length > 0 && (
        <div className="mt-8"><h2 className="mb-2 text-xl font-extrabold">Lịch sử thi gần đây</h2><ul className="grid gap-2 md:grid-cols-2">{p.exams.slice(0, 6).map((e) => <li key={e.date} className="card flex items-center justify-between p-3 font-bold"><span>{new Date(e.date).toLocaleString("vi-VN")}</span><span className="chip text-[#4f46e5]">{e.score}/{e.total}</span></li>)}</ul></div>
      )}
    </div>
  );
}
