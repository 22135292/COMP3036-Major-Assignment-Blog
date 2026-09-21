import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchPostsByYearAndMonth } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const posts = await fetchPostsByYearAndMonth(Number(year), Number(month));
  return (
    <AppLayout currPath={`/history/${year}/${month}`}>
      <Main posts={posts} />
    </AppLayout>
  );
}
