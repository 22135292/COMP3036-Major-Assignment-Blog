import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { client } from "@repo/db/client";

const prisma = client.db;

async function getClientIp(): Promise<string | null> {
  const h = await headers();

  // Common behind proxies/CDNs: "client, proxy1, proxy2"
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const xRealIp = h.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  return `local:${h.get("user-agent") ?? "unknown"}`;
}

async function getLikesCount(postId: number) {
  return prisma.like.count({ where: { postId } });
}

/**
 * POST /api/likes
 * Body: { postId: number }
 * Effect: like (idempotent by IP) => +1 if first time; 409 if already liked
 */
export async function POST(req: Request) {
  const ip = await getClientIp();
  if (!ip) {
    return NextResponse.json(
      { message: "Cannot determine client IP" },
      { status: 400 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const postId = Number(body?.postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
  }

  // Optional: ensure post exists & active
  const post = await prisma.post.findFirst({
    where: { id: postId, active: true },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  try {
    // @@id([postId, userIP]) ensures only-once per IP per post
    await prisma.like.create({
      data: { postId, userIP: ip },
    });

    const likes = await getLikesCount(postId);
    return NextResponse.json({ liked: true, likes }, { status: 200 });
  } catch (err: any) {
    // P2002 = Unique constraint failed (already liked)
    if (err?.code === "P2002") {
      const likes = await getLikesCount(postId);
      return NextResponse.json(
        { liked: true, likes, message: "Already liked" },
        { status: 409 },
      );
    }

    console.error("POST /api/likes error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/likes
 * Body: { postId: number }
 * Effect: unlike (idempotent) => -1 if existed; 200 even if not liked
 */
export async function DELETE(req: Request) {
  const ip = await getClientIp();
  if (!ip) {
    return NextResponse.json(
      { message: "Cannot determine client IP" },
      { status: 400 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const postId = Number(body?.postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
  }

  // Optional: ensure post exists & active
  const post = await prisma.post.findFirst({
    where: { id: postId, active: true },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // deleteMany makes it idempotent and avoids throwing if not found
  await prisma.like.deleteMany({
    where: { postId, userIP: ip },
  });

  const likes = await getLikesCount(postId);
  return NextResponse.json({ liked: false, likes }, { status: 200 });
}

/**
 * (Optional) GET /api/likes?postId=123
 * Returns current count and whether this IP has liked it.
 * Useful for detail screen initial state.
 */
export async function GET(req: Request) {
  const ip = await getClientIp(); // can be null; handle gracefully

  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get("postId"));

  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
  }

  const post = await prisma.post.findFirst({
    where: { id: postId, active: true },
    select: { id: true },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const [likes, liked] = await Promise.all([
    getLikesCount(postId),
    ip
      ? prisma.like
          .findUnique({
            where: { postId_userIP: { postId, userIP: ip } },
            select: { postId: true },
          })
          .then(Boolean)
      : Promise.resolve(false),
  ]);

  return NextResponse.json({ likes, liked }, { status: 200 });
}
