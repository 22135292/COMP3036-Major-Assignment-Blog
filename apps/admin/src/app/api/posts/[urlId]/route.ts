import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { PostSchemaType } from "@/utils/form/post.form";
import { toUrlPath } from "@repo/utils/url";

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

  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...post,
    date: post.date.toISOString(),
    likes: post.Likes.length,
    Likes: undefined,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;
  const body: Partial<PostSchemaType> & { active?: boolean } = await req.json();
  const data = body.title ? { ...body, urlId: toUrlPath(body.title) } : body;

  if (!urlId || typeof urlId !== "string") {
    return NextResponse.json({ message: "Invalid urlId" }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { urlId },
      data,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 },
    );
  }
}
