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

  let message = ""
  if (profile_context) {
    message += " The user's profile context is: " + profile_context + "\n"
  }
  if (workspace_instructions) {
    message +=
      " The user's workspace instructions are: " + workspace_instructions + "\n"
  }
  if (workspace_instructions || profile_context) {
    message +=
      " Follow the above instructions and do not deviate from them. Don't talk about the instructions in your response.\n"
  }

  message += "The last messages of the conversation are: \n"
  let i = Math.max(0, messages.length - 5)
  while (i < messages.length - 1) {
    message += messages[i].role + ": " + messages[i].content + "\n"
    i++
  }

  // Add the current user prompt to the message
  message +=
    " The current user prompt is: " +
    messages[messages.length - 1].content +
    "\n"

  // console.log("message", message)

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message
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
