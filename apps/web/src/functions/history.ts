export function history(posts: { date: Date | string; active: boolean }[]): {
  month: number;
  year: number;
  count: number;
}[] {
  const map = new Map<string, { year: number; month: number; count: number }>();

  for (const post of posts) {
    if (!post.active) continue;

    const date =
      typeof post.date === "string" ? new Date(post.date) : post.date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1–12

    const key = `${year}-${month}`;

    if (map.has(key)) {
      map.get(key)!.count += 1;
    } else {
      map.set(key, { year, month, count: 1 });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.year - a.year || b.month - a.month,
  );
}
