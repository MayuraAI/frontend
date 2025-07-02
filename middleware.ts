import { createClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

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

    const { supabase, response } = createClient(request)
    
    const session = await supabase.auth.getSession()
    const user = session.data.session?.user
    const pathname = request.nextUrl.pathname

    // Define public routes that don't require authentication
    const publicRoutes = [
      '/',           // Home page
      '/login',      // Login page
      '/auth',       // Auth callbacks
      '/api',        // API routes
      '/help',       // Help page
      '/about',      // About page (if exists)
      '/contact',    // Contact page (if exists)
    ]
    
    // Define protected routes that require authentication
    const protectedRoutes = [
      '/chat',       // Chat pages
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
      return response
    }

    // For protected routes, check authentication
    if (isProtectedRoute) {
      // If user is not logged in, redirect to login
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // If user is logged in, check profile setup status
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      // If no profile exists, redirect to setup
      if (error && error.code === "PGRST116") {
        if (pathname !== '/setup') {
          return NextResponse.redirect(new URL('/setup', request.url))
        }
        return response
      }

      // If profile exists but user hasn't completed onboarding
      if (profile && !profile.has_onboarded) {
        if (pathname !== '/setup') {
          return NextResponse.redirect(new URL('/setup', request.url))
        }
        return response
      }

      // If profile exists and user has completed onboarding
      if (profile && profile.has_onboarded) {
        // Don't allow access to setup page for completed users
        if (pathname === '/setup') {
          return NextResponse.redirect(new URL('/chat', request.url))
        }
        return response
      }

      // If we can't determine profile status, redirect to setup to be safe
      if (pathname !== '/setup') {
        return NextResponse.redirect(new URL('/setup', request.url))
      }
    }

    // For logged-in users visiting root, redirect to chat
    if (user && pathname === '/') {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profile && profile.has_onboarded) {
        return NextResponse.redirect(new URL('/chat', request.url))
      } else {
        return NextResponse.redirect(new URL('/setup', request.url))
      }
    }

    return response
  } catch (e) {
    console.error("Middleware error:", e)
    // On error, allow the request to continue but log it
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next).*)",
    "/relay-qesW/:path*"
  ]
}
