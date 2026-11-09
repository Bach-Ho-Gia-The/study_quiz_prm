import { notFound } from "next/navigation";
import Link from "next/link";
import Player from "@/components/Player";
import { BY_ID, QUESTIONS, setQuestions } from "@/lib/data";
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ set?: string; auto?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const q = BY_ID[id];
  if (!q) notFound();
  const list = sp.set ? setQuestions(sp.set) : QUESTIONS;
  const i = list.findIndex((x) => x.id === id);
  const prev = i > 0 ? list[i - 1].id : undefined;
  const next = i >= 0 && i < list.length - 1 ? list[i + 1].id : undefined;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-bold">
        <Link href="/" className="text-[#4f46e5]">Trang chủ</Link> / <Link href={`/library/${sp.set || q.sets[0]}`} className="text-[#4f46e5]">{sp.set || q.sets[0]}</Link> / <span>Câu {q.n}</span>
        <span className="ml-auto text-[#5d6385]">Phím tắt: Space phát/dừng · ←/→ tua 5s</span>
      </div>
      <Player key={id} id={id} prevId={prev} nextId={next} setKey={sp.set} autoStart={sp.auto === "1"} />
    </div>
  );
}
