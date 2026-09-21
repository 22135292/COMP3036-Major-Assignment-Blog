import { NextResponse } from "next/server";
import { client } from "@repo/db/client";

import { PostSchemaType } from "@/utils/form/post.form";
import { toUrlPath } from "@repo/utils/url";

const prisma = client.db;

export async function POST(req: Request) {
  try {
    const body: PostSchemaType = await req.json();

    if (!body.title || !body.description || !body.content || !body.imageUrl || !body.tags) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const urlId = toUrlPath(body.title);

    // Check if urlId already exists
    const existingPost = await prisma.post.findUnique({
      where: { urlId },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "Post with this title already exists" },
        { status: 409 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        ...body,
        category: body.category || "Uncategorized",
        urlId,
        active: true, // Default to active
        views: 0,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 },
    );
  }
}

// GET /api/posts?category=&search=&year=&month=&tag=&page=&limit=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const tag = searchParams.get("tag");
  const active = searchParams.get("active");

  const requestedPage = Number(searchParams.get("page") ?? 1);
  const requestedLimit = Number(searchParams.get("limit") ?? 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 1000)
    : 10;

  const where: any = {
    AND: [],
  };

  if (active === "true" || active === "false") {
    where.active = active === "true";
  }

  if (category) {
    where.AND.push({
      category: {
        contains: category,
      },
    });

  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { content: { contains: search } },
    ];
  }

  if (tag) {
    const tagLabel = tag.trim().toLowerCase().replace(/-/g, " ");
    where.AND.push({
      OR: [{ tags: { contains: tagLabel } }, { tags: { contains: tag } }],
    });
  }

  if (year && month) {
    const y = Number(year);
    const m = Number(month);

    if (Number.isInteger(y) && Number.isInteger(m) && m >= 1 && m <= 12) {
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 1);
      where.date = { gte: start, lt: end };
    } else {
      return NextResponse.json(
        { message: "Invalid year/month" },
        { status: 400 },
      );
    }
  }

  if (where.AND.length === 0) delete where.AND;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { Likes: true },
    }),
    prisma.post.count({ where }),
  ]);

  const data = posts.map((p) => ({
    ...p,
    date: p.date.toISOString(),
    likes: p.Likes.length,
    Likes: undefined,
  }));

  return NextResponse.json({
    page,
    limit,
    total,
    count: data.length,
    data,
  });
}
