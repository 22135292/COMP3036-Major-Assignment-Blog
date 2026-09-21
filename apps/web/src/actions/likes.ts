import { LikeState } from "@/types";

const base =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3001";

/**
 * Get current like state for a post (count + whether current IP liked)
 * GET /api/likes?postId=123
 */
export async function fetchLikeState(
  postId: number,
): Promise<LikeState | null> {
  try {
    const response = await fetch(`${base}/api/likes?postId=${postId}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json()) as LikeState;
      return data;
    }
  } catch (error) {
    console.error(`Error fetching like state for post ${postId}:`, error);
  }

  return null;
}

/**
 * Like a post (only once per IP)
 * POST /api/likes
 * Body: { postId }
 */
export async function likePost(postId: number): Promise<LikeState | null> {
  try {
    const response = await fetch(`${base}/api/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    // 200 = liked now
    // 409 = already liked (still return state)
    if (response.ok || response.status === 409) {
      const data = (await response.json()) as LikeState;
      return data;
    }
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
  }

  return null;
}

/**
 * Unlike a post
 * DELETE /api/likes
 * Body: { postId }
 */
export async function unlikePost(postId: number): Promise<LikeState | null> {
  try {
    const response = await fetch(`${base}/api/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    if (response.ok) {
      const data = (await response.json()) as LikeState;
      return data;
    }
  } catch (error) {
    console.error(`Error unliking post ${postId}:`, error);
  }

  return null;
}
