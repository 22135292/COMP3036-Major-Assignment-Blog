"use client";

import { BlogListItem } from "@/components/Blog/ListItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Post } from "@repo/db/data";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SortBy = "title" | "date";
type SortOrder = "asc" | "desc";

export function BlogList({ posts }: { posts: Post[] }) {
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedPosts = [...posts].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortBy }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toggleSort("title")}
          className="flex items-center rounded-xl"
        >
          Sort by Title <SortIcon field="title" />
        </Button>
        <Button
          variant="outline"
          onClick={() => toggleSort("date")}
          className="flex items-center rounded-xl"
        >
          Sort by Date <SortIcon field="date" />
        </Button>
        </div>
        <Button asChild className="rounded-xl bg-[#a31631] hover:bg-[#841229]">
          <Link href="/posts/create">Create Post</Link>
        </Button>
      </div>

      {sortedPosts.length === 0 ? (
        <p className="p-4 text-center text-gray-500">0 Posts</p>
      ) : (
        <div className="grid w-full gap-4">
          {sortedPosts.map((post) => {
            return (
              <div
                key={`blog-post-${post.id}`}
                data-test-id={`blog-post-${post.id}`}
                className={cn(
                  "rounded-2xl border border-slate-200 bg-white",
                  post.active === false && "opacity-65 grayscale",
                )}
              >
                <BlogListItem post={post} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BlogList;
