export interface ParsedResponse {
  thinking: string | null
  response: string
}

/**
 * Parses AI responses that contain thinking blocks in the format:
 * ◁think▷...thinking content...◁/think▷
 * Regular response content...
 */
export function parseThinkingResponse(content: string): ParsedResponse {
  // Pattern to match thinking blocks
  const thinkingPattern = /◁think▷(.*?)◁\/think▷/s

  const thinkingMatch = content.match(thinkingPattern)

  if (thinkingMatch) {
    const thinking = thinkingMatch[1].trim()
    const response = content.replace(thinkingPattern, "").trim()

    return {
      thinking,
      response
    }
  }

  return {
    thinking: null,
    response: content
  }
}
