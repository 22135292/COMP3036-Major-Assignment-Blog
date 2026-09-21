import { NextResponse } from "next/server";
import { client } from "@repo/db/client";

const prisma = client.db;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;

  if (!urlId || typeof urlId !== "string") {
    return NextResponse.json({ message: "Invalid urlId" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { urlId },
    include: { Likes: true },
  });

  // Kiểm tra active sau khi fetch
  if (!post || !post.active) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  await prisma.post.update({
    where: { urlId },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json({
    ...post,
    views: post.views + 1,
    date: post.date.toISOString(),
    likes: post.Likes.length,
    Likes: undefined,
  });
}
