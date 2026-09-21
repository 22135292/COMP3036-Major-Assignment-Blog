import type { Post } from "@repo/db/data";
import { marked } from "marked";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LikeControls } from "@/components/Blog/LikeControls";
import { CommentSection } from "@/components/Blog/CommentSection";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);
  const dateText = new Date(post.date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");
  return (
    <article
      className="visible mx-auto block w-full max-w-7xl px-5 py-10 opacity-100 lg:px-10 lg:py-14"
      data-test-id={`blog-post-${post.id}`}
    >
      <Card className="overflow-hidden rounded-2xl border-0 bg-transparent shadow-none">
        <CardHeader className="mx-auto max-w-4xl px-0 pb-8 text-center">
          <CardDescription className="order-first mb-4 flex flex-wrap justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#a31631] dark:text-[#ff9aae]">
            <div>{dateText}</div>
            <div>{post.category}</div>
            <div className="flex gap-2">
              {post.tags.split(",").map((t) => <span key={t}>#{t}</span>)}
            </div>
          </CardDescription>
          <CardTitle className="text-center text-4xl font-black leading-tight tracking-[-0.045em] text-slate-950 md:text-6xl dark:text-white">
            <Link href={`/post/${post.urlId}`}>{post.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white p-2 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-white/5">
            <AspectRatio ratio={16 / 7} className="bg-muted overflow-hidden rounded-[1.5rem]">
              {/* Native img supports user-provided URLs without a host allow-list. */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
          <div
            data-test-id="content-markdown"
            className="prose prose-lg prose-slate dark:prose-invert prose-headings:tracking-tight prose-headings:text-slate-950 dark:prose-headings:text-white prose-p:leading-8 prose-a:text-[#a31631] mx-auto max-w-3xl py-12"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="mx-auto flex max-w-3xl justify-end gap-4 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800">
            <LikeControls postId={post.id} initialLikes={post.likes} />

            <div>|</div>

            <span>{post.views} views </span>
          </div>

          <CommentSection postId={post.id} />

          {/* ✅ Short description replaced by formatted long description */}
        </CardContent>
      </Card>
    </article>
  );
}
