import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. PWA files ko hamesha allow karo (inke bina install nahi hoga)
  const pwaFiles = ["/manifest.json", "/manifest.webmanifest", "/sw.js", "/icon-192x192.png", "/icon-512x512.png", "/logo-header.png"];
  if (pwaFiles.some(file => path.includes(file))) {
    return NextResponse.next();
  }

  // 2. Public routes
  if (path === "/" || path.startsWith("/login") || path.startsWith("/signup")) {
    return NextResponse.next();
  }

  // 3. Check auth cookie
  const hasAuthCookie = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
  );

  // 4. Agar logged in hai aur login/signup pe hai -> Dashboard
  if (hasAuthCookie && (path.startsWith("/login") || path.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 5. Agar logged in nahi hai aur protected page hai -> Login
  if (!hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}