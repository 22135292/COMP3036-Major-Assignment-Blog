import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { PaginatedResponse } from "@/types";
import { Post } from "@repo/db/data";

async function findingPostsByQuery(
  query: string,
): Promise<PaginatedResponse<Post>> {
  try {
    const response = await fetch(
      "http://localhost:3001/api/posts?search=" + encodeURIComponent(query),
      { cache: "no-store" },
    );
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  return {
    page: 1,
    limit: 10,
    total: 0,
    count: 0,
    data: [],
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const data = await findingPostsByQuery(q);
  return (
    <AppLayout query={q}>
      <Main posts={data.data} />
    </AppLayout>
  );
}
