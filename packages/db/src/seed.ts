import { client } from "./client.js";
import { posts } from "./data.js";
import { pathToFileURL } from "node:url";

export async function seed() {
  console.log("🌱 Seeding data");
  await client.db.comment.deleteMany();
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  for (const post of posts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}

const entryFile = process.argv[1];
if (entryFile && import.meta.url === pathToFileURL(entryFile).href) {
  seed()
    .then(() => console.log("✅ Seeding finished"))
    .catch((error) => {
      console.error("❌ Seeding failed", error);
      process.exitCode = 1;
    })
    .finally(async () => client.db.$disconnect());
}
