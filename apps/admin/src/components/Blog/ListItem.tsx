"use client";
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
import { Button } from "@/components/ui/button";
import { useOptimistic, startTransition } from "react";
import { togglePostActive } from "@/actions/posts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function BlogListItem({ post }: { post: Post }) {
  const [active, setActive] = useOptimistic(
    post.active,
    (_state, newActive: boolean) => newActive,
  );

  function toggleActive() {
    const nextState = !active;
    startTransition(async () => {
      setActive(nextState);
      const result = await togglePostActive(post.urlId, nextState);
      if (result.success) {
        toast.success(`Post ${nextState ? "activated" : "deactivated"}`);
      } else {
        toast.error("Failed to update post status");
      }
    });
  }

  return (
    <article className={cn(!active && "brightness-[0.8] grayscale")}>
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardContent className="grid gap-5 p-4 transition-shadow hover:shadow-md md:grid-cols-[220px_1fr] md:p-5">
          <div className="w-full overflow-hidden rounded-xl">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              {/* Use a native img because admins may paste an image URL from any host. */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
          <div className="flex h-full flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide">
                <CardDescription>
                  Posted on {formatDate(post.date)}
                </CardDescription>
                <CardDescription>{post.category}</CardDescription>
              </div>
              <Button
                onClick={toggleActive}
                variant={active ? "default" : "outline"}
                className={cn("rounded-full px-4 text-xs", active && "bg-emerald-600 hover:bg-emerald-700")}
              >
                {active ? "Active" : "Inactive"}
              </Button>
            </div>
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-xl font-extrabold tracking-tight text-slate-950">
                <Link href={`/post/${post.urlId}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-md">
                {post.description}
              </CardDescription>
            </CardHeader>
            {/* TAGS */}
            <div className="flex flex-wrap gap-2">
              {post.tags.split(",").map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-2 py-1 text-sm"
                >
                  <Link
                    href={toUrlPath(tag)}
                    key={tag}
                    className="h-full w-full text-xs"
                  >
                    #{tag}
                  </Link>
                </Badge>
              ))}
            </div>
            <div className="h-[0.5px] w-full bg-gray-300/70" />
            <CardFooter className="flex items-center justify-between p-0 text-sm">
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
