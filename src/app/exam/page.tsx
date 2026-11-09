import ExamView from "@/components/ExamView";
export default async function Page({ searchParams }: { searchParams: Promise<{ scope?: string }> }) {
  const sp = await searchParams;
  return <ExamView initialScope={sp.scope} />;
}
