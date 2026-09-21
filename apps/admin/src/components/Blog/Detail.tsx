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
      className="visible block w-full opacity-100"
      data-test-id={`blog-post-${post.id}`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            <Link href={`/post/${post.urlId}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription className="flex gap-4">
            <div>{dateText}</div>
            <div>|</div>
            <div>{post.category}</div>
            <div>|</div>
            <div className="flex gap-2">
              {post.tags.split(",").map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex px-[25%]">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
              {/* Native img supports user-provided URLs without a host allow-list. */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.9] dark:grayscale"
              />
            </AspectRatio>
          </div>
          <div
            data-test-id="content-markdown"
            className="prose prose-slate dark:prose-invert prose-headings:text-left prose-h1:text-3xl prose-h1:font-extrabold prose-h1:mb-6 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-base prose-p:leading-7 prose-p:mb-4 prose-li:my-1 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-pre:rounded-xl prose-pre:bg-slate-900 max-w-none py-4 text-left"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div>
            <span>{post.views} views </span>
            <span>{post.likes} likes</span>
          </div>

          {/* ✅ Short description replaced by formatted long description */}
        </CardContent>
      </Card>
    </article>
  );
}
