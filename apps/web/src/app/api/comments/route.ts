import { client } from "@repo/db/client";
import { NextResponse } from "next/server";

const MAX_AUTHOR_LENGTH = 60;
const MAX_COMMENT_LENGTH = 2000;

export async function GET(request: Request) {
  const postId = Number(new URL(request.url).searchParams.get("postId"));
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "A valid postId is required" }, { status: 400 });
  }

  const comments = await client.db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      author: true,
      content: true,
      createdAt: true,
      parentId: true,
    },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  let payload: { postId?: number; parentId?: number | null; author?: string; content?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const postId = Number(payload.postId);
  const parentId = payload.parentId == null ? null : Number(payload.parentId);
  const author = payload.author?.trim() ?? "";
  const content = payload.content?.trim() ?? "";

  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ error: "A valid postId is required" }, { status: 400 });
  }
  if (!author || author.length > MAX_AUTHOR_LENGTH) {
    return NextResponse.json({ error: "Name must be between 1 and 60 characters" }, { status: 400 });
  }
  if (!content || content.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json({ error: "Comment must be between 1 and 2000 characters" }, { status: 400 });
  }

  if (parentId !== null) {
    const parent = await client.db.comment.findFirst({ where: { id: parentId, postId } });
    if (!parent) {
      return NextResponse.json({ error: "Reply target was not found" }, { status: 404 });
    }
  }

  const comment = await client.db.comment.create({
    data: { postId, parentId, author, content },
    select: {
      id: true,
      author: true,
      content: true,
      createdAt: true,
      parentId: true,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
