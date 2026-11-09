"use client";
import { useSyncExternalStore } from "react";

export type ExamRecord = { date: number; score: number; total: number; scope: string };
export type Progress = {
  mastered: Record<string, number>; // câu đã làm đúng trong đề thi -> không xuất hiện lại
  wrong: Record<string, number>; // số lần sai -> có thể lặp lại
  flagged: Record<string, number>; // đánh dấu để review
  watched: Record<string, number>; // đã xem video
  known: Record<string, number>; // flashcard đã thuộc
  exams: ExamRecord[];
  last?: string;
};

const KEY = "prm-progress-v1";
const EMPTY: Progress = { mastered: {}, wrong: {}, flagged: {}, watched: {}, known: {}, exams: [] };
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const s = localStorage.getItem(KEY);
    cache = { ...EMPTY, ...(s ? JSON.parse(s) : {}) };
  } catch {
    cache = { ...EMPTY };
  }
  return cache as Progress;
}
function write(p: Progress) {
  cache = p;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) { cache = null; l(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
export function useHydrated(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

type Bucket = "mastered" | "wrong" | "flagged" | "watched" | "known";
export const actions = {
  toggle(bucket: Bucket, id: string) {
    const p = read();
    const b = { ...p[bucket] };
    if (b[id]) delete b[id]; else b[id] = bucket === "wrong" ? 1 : Date.now();
    write({ ...p, [bucket]: b });
  },
  set(bucket: Bucket, id: string, on: boolean) {
    const p = read();
    const b = { ...p[bucket] };
    if (on) b[id] = b[id] || Date.now(); else delete b[id];
    write({ ...p, [bucket]: b });
  },
  watch(id: string) {
    const p = read();
    write({ ...p, watched: { ...p.watched, [id]: Date.now() }, last: id });
  },
  clearStatus(ids: string[]) {
    const p = read();
    const m = { ...p.mastered }, w = { ...p.wrong };
    ids.forEach((i) => { delete m[i]; delete w[i]; });
    write({ ...p, mastered: m, wrong: w });
  },
  finishExam(results: { id: string; ok: boolean }[], scope: string) {
    const p = read();
    const m = { ...p.mastered }, w = { ...p.wrong };
    let score = 0;
    results.forEach(({ id, ok }) => {
      if (ok) { score++; m[id] = Date.now(); delete w[id]; }
      else { w[id] = (w[id] || 0) + 1; delete m[id]; }
    });
    write({ ...p, mastered: m, wrong: w, exams: [{ date: Date.now(), score, total: results.length, scope }, ...p.exams].slice(0, 30) });
  },
  resetAll() { write({ ...EMPTY }); },
};
