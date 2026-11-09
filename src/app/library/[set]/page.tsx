import { notFound } from "next/navigation";
import LibraryView from "@/components/LibraryView";
import { SETS } from "@/lib/data";
export function generateStaticParams() { return SETS.map((s) => ({ set: s.key })); }
export default async function Page({ params }: { params: Promise<{ set: string }> }) {
  const { set } = await params;
  if (!SETS.some((s) => s.key === set)) notFound();
  return <LibraryView setKey={set} />;
}
