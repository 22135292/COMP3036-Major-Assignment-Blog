import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { fetchPostByUrlId } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = await fetchPostByUrlId(urlId);

  if (!post) {
    return (
      <AppLayout>
        <p>Post not found.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BlogDetail post={post}></BlogDetail>
    </AppLayout>
  );
}
