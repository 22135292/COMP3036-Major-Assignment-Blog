import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Authentication APIs must never be redirected.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow the sign-in page.
  if (pathname === "/sign-in") {
    return NextResponse.next();
  }

  const passwordToken =
    request.cookies.get("auth_token")?.value;

  if (!passwordToken) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
