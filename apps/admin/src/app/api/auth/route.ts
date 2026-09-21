import { NextResponse } from "next/server";
import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  let data: { password?: string };

  try {
    data = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
      },
      {
        status: 400,
      },
    );
  }

  const submittedPassword = data.password?.trim();
  const configuredPassword = process.env.PASSWORD?.trim() || "123";

  if (!submittedPassword || submittedPassword !== configuredPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Incorrect password.",
      },
      {
        status: 401,
      },
    );
  }

  const token = jwt.sign(
    {
      admin: true,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}