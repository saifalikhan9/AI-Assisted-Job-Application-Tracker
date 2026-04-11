import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/auth/signup");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard");

  
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

 
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};