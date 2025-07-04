import { NextResponse } from "next/server"

// Firebase handles OAuth callbacks differently than Supabase
// This endpoint is mainly for compatibility and redirects
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get("next")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Handle Firebase auth errors
  if (error) {
    console.error("Firebase auth callback error:", error, errorDescription)
    return NextResponse.redirect(
      requestUrl.origin + `/login?message=${errorDescription || error}&type=destructive`
    )
  }

  // For Firebase, the actual auth state change is handled by the client-side SDK
  // This callback is mainly for OAuth redirect handling
  
  // Check if there's a next URL to redirect to
  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  }

  // Default redirect to login page, where the Firebase auth state will be checked
  // and the user will be redirected appropriately
  return NextResponse.redirect(requestUrl.origin + "/login")
}
