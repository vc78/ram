import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"
const { jwtVerify } = jose

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_default_secret_dont_use_in_prod"
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes
  const isPublicRoute = pathname === "/login" || pathname === "/signup" || pathname === "/"

  // Protect dashboard and admin routes
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

  const token = request.cookies.get("auth_token")?.value

  // Redirect to dashboard if already logged in and hitting a public page (like login)
  if (isPublicRoute && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (e) {
      // Token invalid, continue to login page
    }
  }

  // Redirect to login if unauthenticated on a protected route
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin route check
  if (pathname.startsWith("/admin") && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Ensure middleware runs for auth, dashboard, and admin routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
}
