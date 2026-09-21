import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import Link from "next/link";
import { cn } from "@/lib/utils";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((item) => (
        <Link
          href={`/tags/${item.name.toLowerCase().split(" ").join("-")}`}
          key={item.name}
          title={`Tag / ${item.name}`}
          className={cn(
            "flex items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            `/tags/${selectedTag}` ===
              `/tags/${item.name.toLowerCase().split(" ").join("-")}` &&
              "bg-gray-200 text-blue-600",
          )}
        >
          {item.name}
          <span
            data-test-id="post-count"
            className="order-first mr-3 flex size-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-900"
          >
            {item.count}
          </span>
        </Link>
      ))}
    </LinkList>
  );
}
