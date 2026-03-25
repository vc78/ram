import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If accessing /admin paths
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // We cannot use localStorage in middleware, we must rely on cookies or headers.
    // However, the app currently uses localStorage for auth as it's fully client-side.
    // Since this is just a frontend-level middleware check simulation or if we use cookies later.
    // Let's implement a basic check or just redirect if no mock 'admin' cookie is found
    // If we only have client-side auth, middleware can't check localStorage.
    // A better approach for client-side localstorage is what we already have in app/admin/layout.tsx
    // The user requested middleware.ts explicitly:
    /*
      example check:
      if(user.role !== "admin"){
         redirect("/dashboard")
      }
    */
    // We will leave the middleware to pass for now, or check a cookie if they migrate to cookies.
    // Many mock apps without JWT set a cookie during login, let's assume `role` cookie.
    
    const userRole = request.cookies.get('userRole')?.value

    if (!userRole || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
