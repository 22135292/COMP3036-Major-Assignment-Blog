"use server";

import { PostSchema, PostSchemaType } from "@/utils/form/post.form";
import { revalidatePath } from "next/cache";
import { PaginatedResponse } from "@/types";
import { Post } from "@repo/db/data";
// import { deleteImage } from "@/actions/upload";

const base =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3002";

export async function updatePost(urlId: string, data: PostSchemaType) {
  const result = PostSchema.safeParse(data);

  if (!result.success) {
    return { error: "Validation failed" };
  }

  try {
    const response = await fetch(`${base}/api/posts/${urlId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      // can try to parse error message from response
      return { error: "Failed to update post" };
    }

    const updatedPost: Post = await response.json();

    revalidatePath("/");
    revalidatePath(`/post/${urlId}`);
    return { success: true, urlId: updatedPost.urlId };
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Failed to update post" };
  }
}

export async function createPost(data: PostSchemaType) {
  const result = PostSchema.safeParse(data);

  if (!result.success) {
    return { error: "Validation failed" };
  }

  try {
    const response = await fetch(`${base}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      if (response.status === 409) {
        return { error: "Post with this title already exists" };
      }
      return { error: "Failed to create post" };
    }

    const newPost: Post = await response.json();

    revalidatePath("/");
    return { success: true, urlId: newPost.urlId };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}

export async function fetchPosts(
  page: number = 1,
  limit: number = 6,
): Promise<PaginatedResponse<Post>> {
  // Implement your data fetching logic here
  try {
    const response = await fetch(
      `${base}/api/posts?page=${page}&limit=${limit}`,
      { cache: "no-store" },
    );
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  return {
    page: 1,
    limit: 10,
    total: 0,
    count: 0,
    data: [],
  };
}

export async function fetchPostByUrlId(urlId: string): Promise<Post | null> {
  try {
    const response = await fetch(`${base}/api/posts/${urlId}`, { cache: "no-store" });
    if (response.ok) {
      const post = (await response.json()) as Post;
      return post;
    }
  } catch (error) {
    console.error(`Error fetching post with urlId ${urlId}:`, error);
  }
  return null;
}

export async function fetchPostsByYearAndMonth(
  year: number,
  month: number,
): Promise<PaginatedResponse<Post>["data"]> {
  try {
    const response = await fetch(
      `${base}/api/posts?year=${year}&month=${month}`,
    );
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data.data;
    }
  } catch (error) {
    console.error(
      `Error fetching posts for year ${year} and month ${month}:`,
      error,
    );
  }
  return [];
}

export async function fetchPostsByTag(
  tag: string,
): Promise<PaginatedResponse<Post>["data"]> {
  try {
    const response = await fetch(`${base}/api/posts?tag=${tag}`);
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data.data;
    }
  } catch (error) {
    console.error(`Error fetching posts for tag ${tag}:`, error);
  }
  return [];
}

export async function fetchPostsByCategory(
  category: string,
): Promise<PaginatedResponse<Post>["data"]> {
  try {
    const response = await fetch(`${base}/api/posts?category=${category}`);
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data.data;
    }
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
  }
  return [];
}

export async function togglePostActive(urlId: string, active: boolean) {
  try {
    const response = await fetch(`${base}/api/posts/${urlId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    revalidatePath("/");
    revalidatePath(`/post/${urlId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error toggling post active status for ${urlId}:`, error);
    return { success: false, error: "Failed to update post" };
  }
}

type FindPostParams = {
  q?: string;
  tag?: string;
  date?: string; // yyyy-mm-dd
  active?: string;
};

export async function findingPostsByQuery(params: FindPostParams): Promise<Post[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Default limit to fetch enough results for filtering
    queryParams.set("limit", "100");

    if (params.q) {
      queryParams.set("search", params.q);
    }
    if (params.tag) {
      queryParams.set("tag", params.tag);
    }
    if (params.active === "true" || params.active === "false") {
      queryParams.set("active", params.active);
    }
    
    if (params.date) {
      // params.date is yyyy-mm-dd
      const [year, month, day] = params.date.split("-");
      if (year && month) {
          queryParams.set("year", year);
          queryParams.set("month", month);
      }
    }

    const response = await fetch(`${base}/api/posts?${queryParams.toString()}`, { cache: "no-store" });
    
    if (!response.ok) {
        console.error("Search API failed:", response.status);
        return [];
    }

    const json = (await response.json()) as PaginatedResponse<Post>;
    let posts = json.data;

    // Client-side filtering for exact date match if provided
    // (API only filters by month)
    if (params.date) {
        const [y, m, d] = params.date.split("-");
        // Convert input yyyy-mm-dd to dd/mm/yyyy for comparison with en-AU format
        // Or better, compare Date objects or ISO strings.
        // The previous implementation used locale string "en-AU" dd/mm/yyyy
        
        posts = posts.filter(p => {
             const postDate = new Date(p.date).toLocaleDateString("en-AU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            // Construct target date string dd/mm/yyyy
            const targetDate = `${d}/${m}/${y}`;
            return postDate === targetDate;
        });
    }


    return posts;
  } catch (error) {
    console.error("Error finding posts:", error);
    return [];
  }
}
