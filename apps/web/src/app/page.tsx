// import { posts } from "@repo/db/data";
import { fetchPosts } from "@/actions/posts";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page, limit: limitParam } = await searchParams;
  const currentPage = Number(page) || 1;
  const limitValue = Number(limitParam) || 5;
  const { data: posts, total, limit } = await fetchPosts(currentPage, limitValue);
  const totalPages = Math.ceil(total / limit);

  return (
    <AppLayout>
      <Main
        posts={posts}
        className={styles.main}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
      />
    </AppLayout>
  );
}
