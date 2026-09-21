import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { env } from "@repo/env/admin";

async function isPasswordLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_SECRET
    );

    return (
      typeof payload !== "string" &&
      payload.admin === true
    );
  } catch {
    return false;
  }
}

export async function isLoggedIn(): Promise<boolean> {
  return isPasswordLoggedIn();
}
