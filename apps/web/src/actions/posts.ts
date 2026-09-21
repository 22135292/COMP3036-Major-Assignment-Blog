import { PaginatedResponse } from "@/types";
import { Post } from "@repo/db/data";

const base =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3001";

export async function fetchPosts(
  page: number = 1,
  limit: number = 5,
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
      { cache: "no-store" },
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
    const response = await fetch(`${base}/api/posts?tag=${encodeURIComponent(tag)}`, { cache: "no-store" });
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
    const response = await fetch(`${base}/api/posts?category=${encodeURIComponent(category)}`, { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as PaginatedResponse<Post>;
      return data.data;
    }
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
  }
  return [];
}
