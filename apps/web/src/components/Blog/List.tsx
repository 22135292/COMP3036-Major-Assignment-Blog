import { BlogListItem } from "@/components/Blog/ListItem";
import { Post } from "@repo/db/data";

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="w-full">
      {posts.length === 0 ? (
        <p className="p-4 text-center text-gray-500">0 Posts</p>
      ) : (
        <div className="grid w-full gap-6 md:grid-cols-2 xl:gap-8">
          {posts.map((post) => {
            if (!post.active) return null;
            return (
              <div
                key={`blog-post-${post.id}`}
                data-test-id={`blog-post-${post.id}`}
                className="min-w-0"
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
