import { ChatMessage } from "@/types"
import { StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { messages, profile_context, workspace_instructions } = json as {
    messages: ChatMessage[]
    profile_context?: string
    workspace_instructions?: string
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          previous_messages: messages,
          prompt: latestPrompt,
          profile_context,
          workspace_instructions
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`)
    }

    // Transform the response into a friendly text-stream
    const stream = response.body
    return new StreamingTextResponse(stream!)
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
