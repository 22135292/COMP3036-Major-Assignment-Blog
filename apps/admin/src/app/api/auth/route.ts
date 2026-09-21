import { NextResponse } from "next/server";
import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  let data: { password?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (data.password !== env.PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  const token = jwt.sign({ admin: true }, env.JWT_SECRET, { expiresIn: "1h" });
  res.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // expires immediately
  });

  return res;
}
