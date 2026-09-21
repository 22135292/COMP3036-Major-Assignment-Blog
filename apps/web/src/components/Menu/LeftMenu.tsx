// import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { fetchPosts } from "@/actions/posts";

function getCurrentPathClass(currPath: string | undefined): {
  selectedCategory?: string;
  selectedYear?: string;
  selectedMonth?: string;
  selectedTag?: string;
} {
  if (!currPath) {
    return {};
  } else if (currPath.startsWith("/category/")) {
    const category = decodeURIComponent(currPath.replace("/category/", ""));
    return { selectedCategory: category };
  } else if (currPath.startsWith("/history/")) {
    const parts = currPath.replace("/history/", "").split("/");
    const year = parts[0];
    const month = parts[1];
    return { selectedYear: year, selectedMonth: month };
  } else if (currPath.startsWith("/tags/")) {
    const tag = decodeURIComponent(currPath.replace("/tags/", ""));
    return { selectedTag: tag };
  }
  return {};
}

export async function LeftMenu({ currPath }: { currPath?: string }) {
  const activePathClasses = getCurrentPathClass(currPath);
  // Summaries must include every active post, not only the first feed page.
  const { data: posts } = await fetchPosts(1, 1000);
  return (
    <Sidebar className="border-r border-black/5 bg-[#151c24] text-white dark:border-white/10 dark:bg-[#080c12]">
      <SidebarHeader className="border-b border-white/10 px-6 py-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-white">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#dc3150] text-sm font-black text-white shadow-lg shadow-rose-950/30">FS</span>
          <span><span className="block">Full Stack</span><span className="block text-xs font-medium tracking-[0.18em] text-slate-400">JOURNAL</span></span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-1 px-3 py-5 text-slate-200">
        <SidebarGroup className="gap-1">
          <SidebarGroupLabel className="sr-only">Categories</SidebarGroupLabel>
          <CategoryList
            posts={posts}
            selectedCategory={activePathClasses.selectedCategory}
          />
        </SidebarGroup>
        <SidebarGroup className="mt-4 gap-1">
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Archive</SidebarGroupLabel>
          <HistoryList
            selectedYear={activePathClasses.selectedYear}
            selectedMonth={activePathClasses.selectedMonth}
            posts={posts}
          />
        </SidebarGroup>
        <SidebarGroup className="mt-4 gap-1">
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Topics</SidebarGroupLabel>
          <TagList selectedTag={activePathClasses.selectedTag} posts={posts} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 px-5 py-5 text-xs text-slate-500">Built for COMP3036</SidebarFooter>
    </Sidebar>
  );
}
