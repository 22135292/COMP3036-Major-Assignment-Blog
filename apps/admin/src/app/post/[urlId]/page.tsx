import { fetchPostByUrlId } from "@/actions/posts";
import { PostForm } from "@/components/Blog/PostForm";
import LayoutWithNoTop from "@/components/Layouts/LayoutWithNoTop";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = await fetchPostByUrlId(urlId);


  if (!post) {
    return (
      <LayoutWithNoTop>
        <p>Post not found.</p>
      </LayoutWithNoTop>
    );
  }
  
  return (
    <LayoutWithNoTop>
      <PostForm 
        mode="edit" 
        defaultValues={{
            title: post.title,
            category: post.category,
            description: post.description,
            content: post.content,
            imageUrl: post.imageUrl,
            tags: post.tags,
            urlId: post.urlId
        }} 
      />
    </LayoutWithNoTop>
  );
}
