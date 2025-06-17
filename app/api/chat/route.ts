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
      // Handle authentication failures and other errors with streaming format
      if (response.status === 401) {
        // Create a streaming error response for authentication failures
        const errorMessage = "Authentication failed. Please log in again."
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                `data: {"error": "${errorMessage}", "status": 401}\n\n`
              )
            )
            controller.close()
          }
        })
        return new StreamingTextResponse(stream)
      }

      if (response.status === 429) {
        // Create a streaming error response for rate limiting
        const errorMessage =
          "Rate limit exceeded. Please wait before sending another message."
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                `data: {"error": "${errorMessage}", "status": 429}\n\n`
              )
            )
            controller.close()
          }
        })
        return new StreamingTextResponse(stream)
      }

      // Handle other backend errors with streaming format
      const errorMessage = `Backend error: ${response.status} ${response.statusText}`
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: {"error": "${errorMessage}", "status": ${response.status}}\n\n`
            )
          )
          controller.close()
        }
      })
      return new StreamingTextResponse(stream)
    }

    // Transform the response into a friendly text-stream
    const stream = response.body
    return new StreamingTextResponse(stream!)
  } catch (error: any) {
    // Handle abort errors gracefully
    if (error.name === "AbortError" || error.code === "ECONNRESET") {
      console.log("Request aborted by client")
      return new Response(null, { status: 499 }) // Client Closed Request
    }

    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
