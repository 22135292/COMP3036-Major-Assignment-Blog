import type { Post } from "@repo/db/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toUrlPath } from "@repo/utils/url";
import { Badge } from "@/components/ui/badge";
import { HeartIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article>
      <Card className="group h-full overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_65px_-32px_rgba(15,23,42,.5)] dark:border-white/10 dark:bg-[#151c24]">
        <CardContent className="flex h-full flex-col p-0">
          <div className="w-full overflow-hidden p-2.5 pb-0">
            <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-[1.45rem]">
              {/* Native img supports cover URLs pasted from different websites. */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 pt-5">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a31631] dark:text-[#ff9aae]">
              <CardDescription>{formatDate(post.date)}</CardDescription>
              <span className="size-1 rounded-full bg-slate-300" />
              <CardDescription>{post.category}</CardDescription>
            </div>
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white">
                <Link href={`/post/${post.urlId}`} className="decoration-[#dc3150] decoration-2 underline-offset-4 hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {post.description}
              </CardDescription>
            </CardHeader>
            {/* TAGS */}
            <div className="flex flex-wrap gap-2">
              {post.tags.split(",").map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <Link
                    href={`/tags/${toUrlPath(tag)}`}
                    key={tag}
                    className="h-full w-full text-xs"
                  >
                    #{tag}
                  </Link>
                </Badge>
              ))}
            </div>
            <div className="mt-auto h-px w-full bg-slate-100 dark:bg-white/10" />
            <CardFooter className="flex items-center justify-between p-0 text-sm text-slate-500">
              <p>{post.views} views</p>
              <div className="flex items-center gap-2">
                <HeartIcon className="mr-1 inline-block size-5 text-red-500" />
                <span>{post.likes} likes</span>
              </div>
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
