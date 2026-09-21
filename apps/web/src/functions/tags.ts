// import { posts, type Post } from "../components/data";

export function tags(
  posts: { tags: string; active: boolean }[],
): { name: string; count: number }[] {
  const map = new Map<string, number>();

  for (const post of posts) {
    if (!post.active) continue;

    post.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((tag) => {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      });
  }

  return Array.from(map, ([tag, count]) => ({ name: tag, count }));
}
