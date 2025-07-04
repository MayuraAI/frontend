import { NextResponse, type NextRequest } from "next/server"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function middleware(request: NextRequest) {
  try {
    // Handle PostHog proxy requests first
    if (request.nextUrl.pathname.startsWith('/relay-qesW')) {
      // Security: Validate request method (PostHog uses GET and POST)
      if (!['GET', 'POST', 'HEAD'].includes(request.method)) {
        return new NextResponse('Method not allowed', { status: 405 });
      }

      let url = request.nextUrl.clone()
      const hostname = url.pathname.startsWith("/relay-qesW/static/") ? 'us-assets.i.posthog.com' : 'us.i.posthog.com'
      const requestHeaders = new Headers(request.headers)
      
      // Security: Remove potentially dangerous headers
      requestHeaders.delete('x-forwarded-host');
      requestHeaders.delete('x-forwarded-proto');
      requestHeaders.delete('x-real-ip');
      
      // Set the correct host header
      requestHeaders.set('host', hostname);

      url.protocol = 'https'
      url.hostname = hostname
      url.port = '443'
      url.pathname = url.pathname.replace(/^\/relay-qesW/, '');

      return NextResponse.rewrite(url, {
        headers: requestHeaders,
      });
    }

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
