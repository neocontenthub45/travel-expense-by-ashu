import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if auth cookie exists (fast, no network call)
  const hasAuthCookie = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
  );

  // 1. Agar user logged in hai, aur landing/login/signup pe aaya hai -> Dashboard bhejo
  if (hasAuthCookie && (path === "/" || path.startsWith("/login") || path.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2. Agar user logged in NAHI hai, aur protected page access kar raha hai -> Login bhejo
  if (!hasAuthCookie && path !== "/" && !path.startsWith("/login") && !path.startsWith("/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Baaki sab theek hai
  return NextResponse.next();
}