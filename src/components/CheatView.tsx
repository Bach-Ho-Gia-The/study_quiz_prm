"use client";
import Link from "next/link";
import { useState } from "react";
import { QUESTIONS, TOPICS } from "@/lib/data";

const RULES = [
  ["🚰", "Future hay Stream?", "Một lần là Future. Liên tục là Stream. Đăng nhập, đổi liên tục thì Stream."],
  ["🔒", "const hay final?", "const biết lúc dịch code. final biết lúc chạy. Cả hai không đổi sau khi gán."],
  ["🔢", "Mã HTTP", "2 thành công · 3 chuyển hướng · 4 lỗi của bạn · 5 lỗi máy chủ."],
  ["🔺", "Kim tự tháp test", "Unit nhanh và nhiều nhất. Widget ở giữa. Integration chậm, ít nhất."],
  ["🔁", "Câu hỏi vì sao rebuild", "Đúng thường là: dựng lại phần cần thiết, tách nhỏ, dùng const, giữ state gần nơi dùng."],
  ["🛡️", "Câu hỏi bảo mật", "Chọn đáp án có chữ secure, encrypt, HTTPS, token. Bỏ đáp án có hardcode, lưu local."],
  ["🧱", "Câu hỏi kiến trúc", "Hầu hết là bảo trì dễ, kiểm thử dễ, giảm chi phí sửa lại, tái sử dụng."],
  ["🔍", "Mẹo loại trừ", "Đáp án sai thường nhắc tới thứ không liên quan: animation, theme, UI speed."],
];

export default function CheatView() {
  const [s, setS] = useState("");
  const groups = Object.entries(TOPICS).map(([k, t]) => ({ k, t, qs: QUESTIONS.filter((q) => q.vis === k && (!s || (q.q + q.tip + q.vi.q).toLowerCase().includes(s.toLowerCase()))) })).filter((g) => g.qs.length);
  return (
    <div>
      <h1 className="text-3xl font-extrabold md:text-4xl">🔑 Mẹo nhìn đề, bắt từ khóa</h1>
      <p className="mt-1 text-[#5d6385]">Nhìn thấy từ khóa này, nghĩ tới liên tưởng này, chọn đáp án này. Tổng hợp từ {QUESTIONS.length} câu.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {RULES.map(([e, t, d]) => <div key={t} className="card flex gap-3 p-4"><span className="text-3xl">{e}</span><div><div className="text-lg font-extrabold">{t}</div><div className="leading-relaxed text-[#3b4065]">{d}</div></div></div>)}
      </div>
      <input value={s} onChange={(e) => setS(e.target.value)} placeholder="🔎 Tìm từ khóa hoặc mẹo…" aria-label="Tìm mẹo" className="mt-6 min-h-[48px] w-full rounded-xl border-2 border-[#eadfcf] bg-white px-4 font-semibold" />
      <div className="mt-4 flex flex-wrap gap-2">{groups.map(({ k, t }) => <a key={k} href={`#${k}`} className="chip" style={{ color: t.color }}>{t.emoji} {t.label}</a>)}</div>
      {groups.map(({ k, t, qs }) => (
        <section key={k} id={k} className="mt-8 scroll-mt-28">
          <h2 className="text-2xl font-extrabold" style={{ color: t.color }}>{t.emoji} {t.label} <span className="text-base text-[#5d6385]">({qs.length})</span></h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {qs.map((q) => (
              <li key={q.id} className="card p-4">
                <div className="font-bold leading-snug">{q.q}</div>
                <div className="mt-2 rounded-xl bg-[#fff7d6] p-2 font-semibold">🔑 {q.tip}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2"><span className="chip text-[#15803d]">✓ {q.a}. {q.o[q.a]}</span><Link href={`/watch/${q.id}`} className="btn btn-sm ml-auto">▶ Xem</Link></div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
