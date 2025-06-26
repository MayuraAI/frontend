export interface ParsedResponse {
  thinking: string | null
  response: string
  isThinkingPlaceholder: boolean
  isComplete: boolean
}

/**
 * Parses AI responses that contain thinking blocks in the format:
 * ◁think▷...thinking content...◁/think▷
 * Regular response content...
 */
export function parseThinkingResponse(content: string): ParsedResponse {
  // Pattern to match complete thinking blocks
  const thinkingPattern = /◁think▷(.*?)◁\/think▷/s
  
  // Check for placeholder thinking block (completed thinking)
  const placeholderPattern = /◁think▷PLACEHOLDER◁\/think▷/
  
  // Check for incomplete thinking block (live streaming)
  const incompleteThinkingPattern = /◁think▷(.*)$/s

  const thinkingMatch = content.match(thinkingPattern)
  const isPlaceholder = placeholderPattern.test(content)
  const incompleteMatch = !thinkingMatch && content.match(incompleteThinkingPattern)

  // Handle complete thinking block (has closing tag)
  if (thinkingMatch) {
    const thinking = thinkingMatch[1].trim()
    const response = content.replace(thinkingPattern, "").trim()

    return {
      thinking: isPlaceholder ? null : thinking,
      response,
      isThinkingPlaceholder: isPlaceholder,
      isComplete: true // Thinking is complete when we have closing tag
    }
  }

  // Handle incomplete thinking block (live streaming - no closing tag yet)
  if (incompleteMatch) {
    const thinkingContent = incompleteMatch[1]
    const beforeThinking = content.substring(0, content.indexOf('◁think▷'))
    
    return {
      thinking: thinkingContent, // Keep all the thinking content for live display
      response: beforeThinking,
      isThinkingPlaceholder: false,
      isComplete: false // Thinking is still in progress
    }
  }

  // No thinking block found
  return {
    thinking: null,
    response: content,
    isThinkingPlaceholder: false,
    isComplete: false
  }
}
