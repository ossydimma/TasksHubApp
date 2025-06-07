import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = ["/login", "/signup", "/forgetPassword"].some((path) =>
    pathname.startsWith(path)
  );

  const isProtectedPage = [
    "/home",
    "/profile",
    "/settings",
    "/mytasks",
    "/documentation",
    "/createtask",
  ].some((path) => pathname.startsWith(path));

  let isValidRefreshToken = false;

  if (refreshToken) {
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/auth/validate-refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      isValidRefreshToken = res.ok;
    } catch (err) {
      console.error("Token validation failed:", err);
      isValidRefreshToken = false;
    }

    // If user is Authenticated and trying to access auth pages, redirect to home page
    if (isAuthPage && isValidRefreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    // If user is not Authenticated and trying to access protected pages, redirect to login page
    if (isProtectedPage && !isValidRefreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"], // apply to all pages except assets and API
};

