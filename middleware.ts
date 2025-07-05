import { NextResponse, type NextRequest } from "next/server"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Define public routes that don't require authentication
    const publicRoutes = [
      '/',           // Home page
      '/login',      // Login page
      '/auth',       // Auth callbacks (Firebase will handle this differently)
      '/api',        // API routes
      '/help',       // Help page
      '/about',      // About page (if exists)
      '/contact',    // Contact page (if exists)
      '/chat',       // Chat pages (handles anonymous sign-in automatically)
      '/resqW',     // PostHog proxy endpoint
    ]
    
    // Define protected routes that require authentication
    const protectedRoutes = [
      '/setup',      // Setup page
      '/profile',    // Profile pages
    ]

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )
    
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Allow access to public routes regardless of auth status
    if (isPublicRoute && !isProtectedRoute) {
      return NextResponse.next()
    }

    // For protected routes, check authentication via Firebase token
    if (isProtectedRoute) {
      // Get Firebase ID token from cookies or Authorization header
      const authHeader = request.headers.get('authorization')
      const firebaseToken = request.cookies.get('firebase-token')?.value || 
                           (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null)

      // If no token, redirect to login
      if (!firebaseToken) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // For now, if we have a token, let the client-side handle the routing
      // This is simpler and avoids the complexity of JWT decoding in middleware
      return NextResponse.next()
    }

    // Default: allow access
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
