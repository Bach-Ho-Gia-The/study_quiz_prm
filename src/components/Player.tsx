"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BY_ID, LETTERS, TOPICS, type Letter } from "@/lib/data";
import { actions, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sfx";
import { Scene } from "./Visuals";

type Seg = { type: string; text: string; l?: Letter; i?: number; start: number; dur: number };
type Lesson = { id: string; audio: string; segs: Seg[]; total: number };

const GROUPS: { key: string; label: string; types: string[]; emoji: string }[] = [
  { key: "q", label: "Đề bài", types: ["q", "opt"], emoji: "📖" },
  { key: "kw", label: "Từ khóa", types: ["kw"], emoji: "🔍" },
  { key: "ex", label: "Ví dụ", types: ["ex"], emoji: "🎬" },
  { key: "elim", label: "Loại trừ", types: ["elim"], emoji: "✂️" },
  { key: "ans", label: "Đáp án", types: ["ans"], emoji: "✅" },
  { key: "tip", label: "Mẹo nhớ", types: ["tip"], emoji: "🔑" },
  { key: "deep", label: "Tự hỏi sâu", types: ["deepq", "deepa"], emoji: "🤔" },
  { key: "recap", label: "Chốt", types: ["recap"], emoji: "🏆" },
];
const TYPE_COLOR: Record<string, string> = { q: "#4f46e5", opt: "#6366f1", kw: "#f59e0b", ex: "#0ea5a0", elim: "#e11d48", ans: "#16a34a", tip: "#d97706", deepq: "#7c3aed", deepa: "#8b5cf6", recap: "#16a34a" };
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CONF = Array.from({ length: 30 }, (_, i) => ({ dx: `${((i * 37) % 100) - 50}cqmin`, dy: `${-(10 + ((i * 53) % 38))}cqmin`, rot: `${(i * 97) % 720}deg`, c: ["#fbbf24", "#4f46e5", "#16a34a", "#ff6b4a", "#0ea5a0"][i % 5], d: `${(i % 6) * 0.04}s` }));

function Marked({ text, terms }: { text: string; terms: string[] }) {
  const ts = terms.filter((t) => t && text.toLowerCase().includes(t.toLowerCase()));
  if (!ts.length) return <>{text}</>;
  const re = new RegExp(`(${ts.map(esc).join("|")})`, "ig");
  return <>{text.split(re).map((p, i) => (ts.some((t) => t.toLowerCase() === p.toLowerCase()) ? <mark key={i} className="mark">{p}</mark> : <span key={i}>{p}</span>))}</>;
}

export default function Player({ id, prevId, nextId, autoStart, setKey }: { id: string; prevId?: string; nextId?: string; autoStart?: boolean; setKey?: string }) {
  const q = BY_ID[id];
  const topic = TOPICS[q.vis] || TOPICS.tree;
  const router = useRouter();
  const prog = useProgress();
  const audioRef = useRef<HTMLAudioElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [err, setErr] = useState(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [subs, setSubs] = useState(true);
  const [fx, setFx] = useState(true);
  const [music, setMusic] = useState(false);
  const [auto, setAuto] = useState(true);
  const [fs, setFs] = useState(false);
  const lastIdx = useRef(-1);
  const qs = setKey ? `?set=${setKey}` : "";

  useEffect(() => {
    let ok = true;
    fetch(`/lessons/${id}.json`).then((r) => (r.ok ? r.json() : Promise.reject())).then((l: Lesson) => ok && setLesson(l)).catch(() => ok && setErr(true));
    return () => { ok = false; };
  }, [id]);

  const segs = lesson?.segs ?? [];
  const total = lesson?.total ?? 0;
  const idx = useMemo(() => {
    let k = 0;
    for (let i = 0; i < segs.length; i++) if (segs[i].start <= t + 0.02) k = i;
    return k;
  }, [segs, t]);
  const seg = segs[idx];

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    sfx.unlock();
    a.playbackRate = rate;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [rate]);
  const pause = useCallback(() => { audioRef.current?.pause(); setPlaying(false); }, []);
  const seek = useCallback((time: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(time, Math.max(0, total - 0.05)));
    setT(a.currentTime);
  }, [total]);

  // đồng bộ thời gian
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const a = audioRef.current;
      if (a) setT((p) => (Math.abs(p - a.currentTime) > 0.03 ? a.currentTime : p));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate; }, [rate]);
  useEffect(() => { if (lesson && autoStart) setTimeout(play, 400); }, [lesson, autoStart, play]);
  useEffect(() => { actions.watch(id); }, [id]);
  useEffect(() => { try { const v = localStorage.getItem("prm-auto"); if (v) setAuto(v === "1"); const m = localStorage.getItem("prm-music"); if (m === "1") setMusic(true); const f = localStorage.getItem("prm-fx"); if (f === "0") setFx(false); } catch {} }, []);
  useEffect(() => { if (playing && music) sfx.musicOn(); else sfx.musicOff(); return () => sfx.musicOff(); }, [playing, music]);
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  // hiệu ứng âm thanh theo từng cảnh
  useEffect(() => {
    if (!playing || !seg || lastIdx.current === idx) { lastIdx.current = playing ? idx : lastIdx.current; return; }
    lastIdx.current = idx;
    if (!fx) return;
    const m: Record<string, () => void> = { q: sfx.whoosh, opt: sfx.pop, kw: sfx.sparkle, ex: sfx.whoosh, elim: sfx.buzz, ans: sfx.ding, tip: sfx.sparkle, deepq: sfx.pop, deepa: sfx.ding, recap: sfx.cheer };
    m[seg.type]?.();
  }, [idx, playing, seg, fx]);

  const onEnded = () => {
    setPlaying(false);
    if (auto && nextId) setTimeout(() => router.push(`/watch/${nextId}?${setKey ? `set=${setKey}&` : ""}auto=1`), 1500);
  };

  // trạng thái cảnh
  const optSeen = segs.slice(0, idx + 1).filter((s) => s.type === "opt").length;
  const afterAns = seg && ["ans", "tip", "deepq", "deepa", "recap"].includes(seg.type);
  const inKw = seg?.type === "kw";
  const kwPassed = segs.slice(0, idx + 1).filter((s) => s.type === "kw").length;
  const elimSet = new Set(segs.slice(0, idx).filter((s) => s.type === "elim").map((s) => s.l));
  const showAll = !seg || !["q", "opt"].includes(seg.type) ? true : false;
  const revealed = !seg ? 4 : seg.type === "q" ? 0 : seg.type === "opt" ? optSeen : 4;
  const terms = q.kw.slice(0, inKw ? kwPassed : seg && ["q", "opt"].includes(seg.type) ? 0 : q.kw.length).map((k) => k[0]);

  // phụ đề từng từ
  const words = seg ? seg.text.split(/\s+/) : [];
  const p = seg ? Math.min(1, Math.max(0, (t - seg.start) / (seg.dur * 0.92))) : 0;
  const onWords = Math.floor(p * words.length + 0.5);

  const groupStart = (g: (typeof GROUPS)[number]) => segs.find((s) => g.types.includes(s.type))?.start ?? 0;
  const curGroup = GROUPS.findIndex((g) => seg && g.types.includes(seg.type));
  const optState = (l: Letter, i: number) => {
    if (i >= revealed) return "opt-row opt-hidden";
    if (afterAns) return `opt-row ${l === q.a ? "opt-correct" : "opt-out"}`;
    if (seg?.type === "opt" && seg.l === l) return "opt-row opt-active opt-show";
    if (seg?.type === "elim" && seg.l === l) return "opt-row opt-flash";
    if (elimSet.has(l)) return "opt-row opt-out";
    return "opt-row";
  };

  const toggleFs = () => {
    const el = boxRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen?.();
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === "Space") { e.preventDefault(); playing ? pause() : play(); }
      if (e.code === "ArrowRight") seek(t + 5);
      if (e.code === "ArrowLeft") seek(t - 5);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [playing, play, pause, seek, t]);

  const rightPanel = () => {
    if (!seg) return <div className="a-float" style={{ fontSize: "14cqmin" }}>{topic.emoji}</div>;
    const big = { fontSize: "clamp(15px, 3.3cqmin, 38px)" } as const;
    switch (seg.type) {
      case "q":
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1.4cqmin]">
            <div className="a-float" style={{ fontSize: "15cqmin", lineHeight: 1 }}>{topic.emoji}</div>
            <div className="font-extrabold" style={{ fontSize: "clamp(22px, 6.5cqmin, 72px)", color: topic.color, lineHeight: 1 }}>Câu {q.n}</div>
            <span className="chip" style={{ color: topic.color, fontSize: "clamp(11px, 2.1cqmin, 22px)" }}>{topic.label}</span>
          </div>
        );
      case "opt":
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1cqmin]">
            <div style={{ fontSize: "clamp(40px, 17cqmin, 150px)", fontWeight: 800, color: "#4f46e5", lineHeight: 1 }} className="a-pulse">{seg.l}</div>
            <div className="font-bold text-[#5d6385]" style={{ fontSize: "clamp(12px, 2.6cqmin, 28px)" }}>{q.vi.o[LETTERS.indexOf(seg.l as Letter)]}</div>
          </div>
        );
      case "kw": {
        const k = q.kw[seg.i ?? 0] || ["", ""];
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1.5cqmin] px-[2cqmin]">
            <div style={{ fontSize: "9cqmin" }} className="a-float">🔍</div>
            <div className="font-extrabold rounded-2xl px-[3cqmin] py-[1cqmin]" style={{ background: "#fef08a", fontSize: "clamp(18px, 5cqmin, 56px)", lineHeight: 1.1, wordBreak: "break-word" }}>{k[0]}</div>
            <div style={{ fontSize: "clamp(18px, 3cqmin, 30px)" }}>↓</div>
            <div className="font-bold text-[#4f46e5]" style={{ ...big, fontSize: "clamp(15px, 3.8cqmin, 42px)" }}>{k[1]}</div>
          </div>
        );
      }
      case "ex":
        return (
          <div key={idx} className="w-full h-full flex flex-col items-center">
            <div className="flex-1 min-h-0 w-full"><Scene vis={q.vis} playing={playing || t === 0} /></div>
          </div>
        );
      case "elim":
        return (
          <div key={idx} className="a-shake flex flex-col items-center text-center gap-[1.5cqmin] px-[2cqmin]">
            <div style={{ fontSize: "clamp(40px, 15cqmin, 140px)", lineHeight: 1 }}>❌</div>
            <div className="font-extrabold line-through decoration-[#e11d48] decoration-4" style={{ fontSize: "clamp(15px, 3.6cqmin, 40px)", wordBreak: "break-word" }}>{seg.l}. {q.o[seg.l as Letter]}</div>
            <div className="font-semibold text-[#e11d48]" style={{ fontSize: "clamp(12px, 2.4cqmin, 26px)" }}>Loại!</div>
          </div>
        );
      case "ans":
      case "recap":
        return (
          <div key={idx} className="a-pop relative w-full h-full flex flex-col items-center justify-center text-center gap-[1.5cqmin] px-[2cqmin]">
            {seg.type === "ans" && CONF.map((c, i) => <span key={i} className="confetti-bit" style={{ background: c.c, animationDelay: c.d, ["--dx" as string]: c.dx, ["--dy" as string]: c.dy, ["--rot" as string]: c.rot } as React.CSSProperties} />)}
            <div style={{ fontSize: "clamp(40px, 15cqmin, 140px)", lineHeight: 1 }} className="a-pulse">{seg.type === "ans" ? "✅" : "🏆"}</div>
            <div className="font-extrabold text-[#15803d]" style={{ fontSize: "clamp(16px, 4cqmin, 46px)", lineHeight: 1.15, wordBreak: "break-word" }}>{q.a}. {q.o[q.a]}</div>
          </div>
        );
      case "tip": {
        const first = q.kw[0]?.[0];
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1.6cqmin] px-[2cqmin] w-full">
            <div className="chip" style={{ color: "#b45309", background: "#fef3c7", fontSize: "clamp(12px, 2.4cqmin, 26px)" }}>🔑 MẸO NHỚ</div>
            <div className="font-extrabold" style={{ fontSize: "clamp(15px, 3.4cqmin, 38px)", lineHeight: 1.3 }}>{q.tip}</div>
            <div className="flex items-center gap-[1.5cqmin] flex-wrap justify-center" style={{ fontSize: "clamp(12px, 2.5cqmin, 28px)" }}>
              {first && <span className="rounded-xl bg-[#fef08a] px-3 py-1 font-bold">{first}</span>}
              <span className="a-pulse text-2xl">➜</span>
              <span className="rounded-xl bg-[#bbf7d0] px-3 py-1 font-extrabold" style={{ wordBreak: "break-word" }}>{q.a}</span>
            </div>
          </div>
        );
      }
      case "deepq":
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1.5cqmin] px-[2cqmin]">
            <div style={{ fontSize: "clamp(36px, 12cqmin, 110px)", lineHeight: 1 }} className="a-float">🤔</div>
            <div className="rounded-3xl bg-[#ede9fe] px-[2.5cqmin] py-[1.5cqmin] font-extrabold text-[#5b21b6]" style={{ fontSize: "clamp(15px, 3.3cqmin, 38px)", lineHeight: 1.25 }}>{q.deep[0]}</div>
          </div>
        );
      case "deepa":
        return (
          <div key={idx} className="a-pop flex flex-col items-center text-center gap-[1.5cqmin] px-[2cqmin]">
            <div style={{ fontSize: "clamp(36px, 12cqmin, 110px)", lineHeight: 1 }} className="a-pulse">💡</div>
            <div className="rounded-3xl bg-[#fef9c3] px-[2.5cqmin] py-[1.5cqmin] font-bold" style={{ fontSize: "clamp(14px, 3cqmin, 34px)", lineHeight: 1.3 }}>{q.deep[1]}</div>
          </div>
        );
    }
    return null;
  };

  const known = !!prog.mastered[id];
  return (
    <div>
      <div ref={boxRef} className="fs-wrap stage-wrap">
        <div className="stage">
          <div className="stage-grid">
            <div className="panel-left">
              <div className="flex items-start gap-[1.2cqmin]">
                <span className="chip shrink-0" style={{ color: topic.color, fontSize: "clamp(10px, 1.9cqmin, 20px)" }}>{topic.emoji} Câu {q.n}</span>
              </div>
              <div className="q-en"><Marked text={q.q} terms={terms} /></div>
              <div className="q-vi">{q.vi.q}</div>
              <div className="flex flex-col gap-[1cqmin] min-h-0">
                {LETTERS.map((l, i) => (
                  <div key={l} className={optState(l, i)}>
                    <span className="badge">{afterAns && l === q.a ? "✓" : l}</span>
                    <div className="min-w-0"><div className="opt-en" style={{ wordBreak: "break-word" }}>{q.o[l]}</div>{q.vi.o[i].toLowerCase() !== q.o[l].toLowerCase() && <div className="opt-vi">{q.vi.o[i]}</div>}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-right">{rightPanel()}</div>
          </div>
          {!playing && t < 0.2 && lesson && (
            <button onClick={play} aria-label="Bắt đầu phát" className="absolute inset-0 grid place-items-center bg-[#1f2340]/35 backdrop-blur-[2px] z-10">
              <span className="btn btn-coral text-xl px-8 py-4" style={{ minHeight: 64 }}>▶ Bấm để xem bài giảng</span>
            </button>
          )}
          {!lesson && !err && <div className="absolute inset-0 grid place-items-center bg-white/70 font-bold">Đang tải bài giảng…</div>}
          {err && <div className="absolute inset-0 grid place-items-center bg-white/90 font-bold text-center p-6">Chưa có bài giảng cho câu này.</div>}
        </div>

        <div className="sub-bar" aria-live="off" style={{ display: subs ? "flex" : "none" }}>
          <span>{words.map((w, i) => <span key={i} className={`w ${i < onWords ? "on" : ""}`}>{w}{" "}</span>)}</span>
        </div>

        <div className="mt-3 card !shadow-none px-3 py-3">
          <div className="relative h-5 cursor-pointer rounded-full overflow-hidden bg-[#efe7d8]" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * total); }} role="slider" aria-label="Thanh thời gian" aria-valuemin={0} aria-valuemax={Math.round(total)} aria-valuenow={Math.round(t)}>
            {segs.map((s, i) => <div key={i} className="absolute top-0 h-full" style={{ left: `${(s.start / total) * 100}%`, width: `${(s.dur / total) * 100}%`, background: TYPE_COLOR[s.type], opacity: i < idx ? 0.95 : i === idx ? 0.8 : 0.28, borderRight: "2px solid #fff" }} />)}
            <div className="absolute top-0 h-full w-1 bg-[#1f2340]" style={{ left: `${(t / (total || 1)) * 100}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {prevId ? <Link className="btn btn-sm" href={`/watch/${prevId}${qs}`} aria-label="Câu trước">⏮</Link> : <span className="btn btn-sm opacity-40">⏮</span>}
            <button className="btn btn-primary" style={{ minWidth: 104 }} onClick={() => (playing ? pause() : (t >= total - 0.1 ? (seek(0), play()) : play()))}>{playing ? "⏸ Tạm dừng" : t >= total - 0.1 && total > 0 ? "↺ Xem lại" : "▶ Phát"}</button>
            {nextId ? <Link className="btn btn-sm" href={`/watch/${nextId}${qs}`} aria-label="Câu sau">⏭</Link> : <span className="btn btn-sm opacity-40">⏭</span>}
            <span className="mono text-sm font-bold text-[#5d6385] mx-1">{fmt(t)} / {fmt(total)}</span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button className="btn btn-sm" onClick={() => setRate((r) => ({ 1: 1.15, 1.15: 1.3, 1.3: 0.85, 0.85: 1 } as Record<number, number>)[r] ?? 1)} aria-label="Tốc độ">{rate}x</button>
              <button className={`btn btn-sm ${subs ? "btn-sun" : ""}`} onClick={() => setSubs(!subs)} aria-pressed={subs}>CC</button>
              <button className={`btn btn-sm ${fx ? "btn-sun" : ""}`} onClick={() => { setFx(!fx); localStorage.setItem("prm-fx", fx ? "0" : "1"); }} aria-pressed={fx} title="Âm thanh hiệu ứng">🔔</button>
              <button className={`btn btn-sm ${music ? "btn-sun" : ""}`} onClick={() => { setMusic(!music); localStorage.setItem("prm-music", music ? "0" : "1"); }} aria-pressed={music} title="Nhạc nền nhẹ">🎵</button>
              <button className={`btn btn-sm ${auto ? "btn-sun" : ""}`} onClick={() => { setAuto(!auto); localStorage.setItem("prm-auto", auto ? "0" : "1"); }} aria-pressed={auto} title="Tự chuyển câu sau">⏭ Tự động</button>
              <button className="btn btn-sm" onClick={toggleFs} aria-label="Toàn màn hình">{fs ? "🗗" : "⛶"}</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {GROUPS.map((g, i) => (
              <button key={g.key} onClick={() => { seek(groupStart(g)); if (!playing) play(); }} className="chip !px-3 !py-1" style={{ color: i === curGroup ? "#fff" : "#5d6385", background: i === curGroup ? "#4f46e5" : "#fff", borderColor: i === curGroup ? "#4f46e5" : "#e0d5c3" }}>{g.emoji} {g.label}</button>
            ))}
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={lesson?.audio} preload="auto" onEnded={onEnded} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} onTimeUpdate={(e) => !playing && setT(e.currentTarget.currentTime)} />
      <div className="sr-only">{showAll ? "" : ""}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="text-sm font-bold text-[#5d6385]">Đáp án</div>
          <div className="mt-1 text-xl font-extrabold text-[#15803d]">{q.a}. {q.o[q.a]}</div>
          <p className="mt-2 text-[1.05rem] leading-relaxed">{q.why}</p>
          <div className="mt-3 rounded-2xl bg-[#fff7d6] p-3 font-semibold">🔑 {q.tip}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={`btn btn-sm ${known ? "btn-green" : ""}`} onClick={() => actions.toggle("mastered", id)}>{known ? "✓ Đã thuộc" : "Đánh dấu đã thuộc"}</button>
            <button className={`btn btn-sm ${prog.flagged[id] ? "btn-sun" : ""}`} onClick={() => actions.toggle("flagged", id)}>{prog.flagged[id] ? "★ Đã đánh dấu" : "☆ Đánh dấu ôn lại"}</button>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-bold text-[#5d6385]">Nguồn đề & tài liệu</div>
          <ul className="mt-2 space-y-1 text-[0.98rem]">
            {q.src.map((s) => <li key={s}>📷 Ảnh đề: <span className="font-semibold">{s}</span> <span className="text-[#5d6385]">(thư mục Drive “Prm ôn thi”)</span></li>)}
            <li>📚 Tài liệu chính thống: <a className="font-bold text-[#4f46e5] underline" href={topic.url} target="_blank" rel="noopener noreferrer">{topic.site}</a></li>
            <li className="text-[#5d6385] text-sm">Đáp án theo đề gốc nếu ảnh có ghi “Đáp án”, các câu còn lại do tôi đối chiếu tài liệu.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
