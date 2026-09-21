import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchPostsByCategory } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const posts = await fetchPostsByCategory(name);


  return (
    <AppLayout currPath={`/category/${name}`}>
      <Main posts={posts} />
    </AppLayout>
  );
}
