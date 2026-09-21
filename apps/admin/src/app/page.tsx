

import styles from "./page.module.css";

import MainLayout from "@/components/Layouts/MainLayout";
import { Main } from "@/components/Main";
import { fetchPosts } from "@/actions/posts";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const { page, limit: limitParam } = await searchParams;
  const currentPage = Number(page) || 1;
  const limitValue = Number(limitParam) || 5;
  const { data: posts, total, limit } = await fetchPosts(currentPage, limitValue);
  const totalPages = Math.ceil(total / limit);

  return (
    <MainLayout>
      <Main
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
      />
    </MainLayout>
  );
}
