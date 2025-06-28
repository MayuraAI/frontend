import { ChatMessage } from "@/types"
import { createClient } from "@supabase/supabase-js"
import { StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(request: Request) {
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

  const json = await request.json()
  const { messages, profile_context } = json as {
    messages: ChatMessage[]
    profile_context?: string
  }

  const latestPrompt = messages[messages.length - 1].content

  if (!latestPrompt) {
    return new Response("No prompt in the request", { status: 400 })
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          previous_messages: messages,
          prompt: latestPrompt,
          profile_context
        }),
        signal: request.signal
      }
    )

    if (!response.ok) {
      // Pass through the exact status code and error message from backend
      let errorMessage: string
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || `Backend error: ${response.status} ${response.statusText}`
      } catch {
        // If response body is not JSON, use status text
        errorMessage = `Backend error: ${response.status} ${response.statusText}`
      }

      return new Response(
        JSON.stringify({ 
          message: errorMessage,
          error: errorMessage 
        }), 
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            // Pass through rate limit headers if they exist
            ...(response.headers.get('X-RateLimit-Limit') && {
              'X-RateLimit-Limit': response.headers.get('X-RateLimit-Limit')!
            }),
            ...(response.headers.get('X-RateLimit-Remaining') && {
              'X-RateLimit-Remaining': response.headers.get('X-RateLimit-Remaining')!
            }),
            ...(response.headers.get('X-RateLimit-Reset') && {
              'X-RateLimit-Reset': response.headers.get('X-RateLimit-Reset')!
            }),
            ...(response.headers.get('X-RateLimit-Reset-After') && {
              'X-RateLimit-Reset-After': response.headers.get('X-RateLimit-Reset-After')!
            })
          }
        }
      )
    }

    // For successful responses, pass through rate limit headers and return the stream
    const headers: Record<string, string> = {}
    
    // Pass through rate limit headers
    if (response.headers.get('X-RateLimit-Limit')) {
      headers['X-RateLimit-Limit'] = response.headers.get('X-RateLimit-Limit')!
    }
    if (response.headers.get('X-RateLimit-Remaining')) {
      headers['X-RateLimit-Remaining'] = response.headers.get('X-RateLimit-Remaining')!
    }
    if (response.headers.get('X-RateLimit-Reset')) {
      headers['X-RateLimit-Reset'] = response.headers.get('X-RateLimit-Reset')!
    }
    if (response.headers.get('X-RateLimit-Reset-After')) {
      headers['X-RateLimit-Reset-After'] = response.headers.get('X-RateLimit-Reset-After')!
    }

    // Transform the response into a friendly text-stream
    const stream = response.body
    return new StreamingTextResponse(stream!, { headers })
  } catch (error: any) {
    // Handle abort errors gracefully
    if (error.name === "AbortError" || error.code === "ECONNRESET") {
      console.log("Request aborted by client")
      return new Response(null, { status: 499 }) // Client Closed Request
    }

    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ 
      message: errorMessage,
      error: errorMessage 
    }), {
      status: errorCode,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
