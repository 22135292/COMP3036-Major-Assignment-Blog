import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  if (data.password !== "123") {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: "auth_token",
    value: "mocked-token-123",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    // optional:
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
