import { createClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
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
  matcher: "/((?!api|static|.*\\..*|_next).*)"
}
