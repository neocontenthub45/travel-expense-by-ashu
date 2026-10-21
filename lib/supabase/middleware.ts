import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public routes
  if (path === "/" || path.startsWith("/login") || path.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Check if auth cookie exists (fast, no network call)
  const hasAuthCookie = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
  );

  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}