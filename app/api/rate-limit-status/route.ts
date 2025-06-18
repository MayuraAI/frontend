import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function GET(request: Request) {
  // Get the authorization header
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Missing or invalid authorization header", {
      status: 401
    })
  }

  const token = authHeader.replace("Bearer ", "")

  // Optionally validate the token using Supabase (for extra security)
  if (process.env.VALIDATE_TOKEN_IN_PROXY === "true") {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Validate the token by trying to get the user
      const {
        data: { user },
        error
      } = await supabase.auth.getUser(token)

      if (error || !user) {
        return new Response("Invalid or expired token", { status: 401 })
      }
    } catch (error) {
      return new Response("Token validation failed", { status: 401 })
    }
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/rate-limit-status",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        signal: request.signal
      }
    )

    if (!response.ok) {
      // Handle authentication failures and other errors
      if (response.status === 401) {
        return new Response(
          JSON.stringify({
            error: "Authentication failed. Please log in again."
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      }

      // Handle other backend errors
      const errorMessage = `Backend error: ${response.status} ${response.statusText}`
      return new Response(
        JSON.stringify({
          error: errorMessage
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get the response data
    const data = await response.json()

    // Return the response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error: any) {
    // Handle abort errors gracefully
    if (error.name === "AbortError" || error.code === "ECONNRESET") {
      console.log("Request aborted by client")
      return new Response(null, { status: 499 }) // Client Closed Request
    }

    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        status: errorCode,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}
