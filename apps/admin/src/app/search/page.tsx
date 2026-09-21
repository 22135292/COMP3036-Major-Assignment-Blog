import { findingPostsByQuery } from "@/actions/posts";
import MainLayout from "@/components/Layouts/MainLayout";
import { Main } from "@/components/Main";



export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; tag?: string; date?: string; active?: string }>;
}) {
  const params = await searchParams;
  const content = params?.q ?? "";
  const tag = params?.tag ?? "";
  const date = params?.date ?? "";
  const active = params?.active ?? "";

  return (
    <MainLayout query={content} tag={tag} date={date} active={active}>
      <Main posts={await findingPostsByQuery({ q: content, tag, date, active })} />
    </MainLayout>
  );
}
