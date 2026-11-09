"use client";
// Âm thanh hiệu ứng tạo bằng WebAudio (không cần file), âm lượng nhỏ để không át giọng đọc.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicGain: GainNode | null = null;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slideTo?: number) {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime + when;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}
export const sfx = {
  unlock() { ac(); },
  pop() { tone(520, 0.12, "sine", 0.1, 0, 880); },
  whoosh() { tone(900, 0.28, "triangle", 0.05, 0, 200); },
  ding() { [660, 880, 1320].forEach((f, i) => tone(f, 0.35, "sine", 0.11, i * 0.09)); },
  buzz() { tone(190, 0.22, "sawtooth", 0.05, 0, 120); },
  sparkle() { [1200, 1600, 2000, 1500].forEach((f, i) => tone(f, 0.18, "sine", 0.05, i * 0.06)); },
  cheer() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.4, "triangle", 0.09, i * 0.1)); },
  wrong() { tone(300, 0.3, "square", 0.05, 0, 150); },
  click() { tone(700, 0.06, "square", 0.04); },
  musicOn(vol = 0.035) {
    const c = ac();
    if (!c || !master || musicTimer) return;
    musicGain = c.createGain();
    musicGain.gain.value = vol;
    musicGain.connect(master);
    const chords = [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]];
    let i = 0;
    const play = () => {
      if (!ctx || !musicGain) return;
      const ch = chords[i++ % chords.length];
      ch.forEach((f, k) => {
        const o = ctx!.createOscillator();
        const g = ctx!.createGain();
        const t = ctx!.currentTime + k * 0.5;
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5, t + 0.2);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
        o.connect(g).connect(musicGain!);
        o.start(t);
        o.stop(t + 2);
      });
    };
    play();
    musicTimer = setInterval(play, 2000);
  },
  musicOff() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    if (musicGain) { try { musicGain.disconnect(); } catch {} musicGain = null; }
  },
};
