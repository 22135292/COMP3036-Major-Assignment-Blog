import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchPostsByTag } from "@/actions/posts";
import { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const posts = await fetchPostsByTag(name);

  return (
    <AppLayout currPath={`/tags/${name}`}>
      <Main posts={posts} />
    </AppLayout>
  );
}
