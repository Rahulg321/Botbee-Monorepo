import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  PROTECTED_BASE_ROUTES,
} from "./routes";

import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  console.log("middleware", nextUrl.pathname);
  // Run auth only for protected routes
  const isProtectedRoute = PROTECTED_BASE_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  // Only check auth for protected routes
  let isLoggedIn = false;
  if (isProtectedRoute) {
    const session = await auth();
    isLoggedIn = !!session;
    if (!isLoggedIn) {
      console.log("inside protected route");
      console.log("protected route", nextUrl.pathname);
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPublicRoute) {
    console.log("inside public route");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
