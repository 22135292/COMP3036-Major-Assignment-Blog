import { NextResponse } from "next/server";
import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SignInRequest = {
  password?: string;
};

export async function POST(request: Request) {
  let data: SignInRequest;

  try {
    data = await request.json();
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
  const configuredPassword = "123";

  if (!submittedPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Password is required.",
      },
      {
        status: 400,
      },
    );
  }

  if (submittedPassword !== configuredPassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Incorrect password. Please try again.",
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

  const response = NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
    },
  );

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    // Production builds are also used by Playwright on HTTP localhost.
    // Mark the cookie as secure only when the current request uses HTTPS.
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
    },
  );

  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}