import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request : NextRequest) {
    const {pathname} = request.nextUrl;
    const token = request.cookies.get("authToken")?.value;

    const isAuthPages = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgetPassword");
    const isProtectedPages = pathname.startsWith("/home") || pathname.startsWith("/profile") || pathname.startsWith("/settings") || pathname.startsWith("/mytasks") || pathname.startsWith("/documentation") || pathname.startsWith("/createtask") ;

    // If user is Authenticated and trying to access protected pages, redirect to home page
    if (isAuthPages && token) {
        const url = request.nextUrl.clone();
        url.pathname = "/home";
        return NextResponse.redirect(url);
    }

    // // If user is not Authenticated and trying to access protected pages, redirect to login page
    // if (isProtectedPages && !token) {
    //     const url = request.nextUrl.clone();
    //     url.pathname = "/login";
    //     return NextResponse.redirect(url);
    // }


    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/mytasks/:path*",
        "/documentation/:path*",
        "/createtask/:path*",
        "/login/",
        "/signup/",
        "/forgetPassword/"
    ]
};