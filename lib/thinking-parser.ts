export interface ParsedResponse {
  thinking: string | null
  response: string
  isThinkingPlaceholder: boolean
  thinkingFlow?: string
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

  // Handle complete thinking block
  if (thinkingMatch) {
    const thinking = thinkingMatch[1].trim()
    const response = content.replace(thinkingPattern, "").trim()

    // Create a flowing summary for single-row display (only for completed thinking)
    let thinkingFlow = ""
    if (!isPlaceholder && thinking && thinking !== "PLACEHOLDER") {
      // Extract key phrases and create a flowing summary
      const cleanThinking = thinking.replace(/\*\*/g, '').replace(/\*/g, '') // Remove markdown
      const sentences = cleanThinking.split(/[.!?]+/).filter(s => s.trim().length > 10)
      
      if (sentences.length > 0) {
        const keyPhrases = sentences
          .slice(0, 2) // Take first 2 sentences
          .map(s => s.trim().substring(0, 60)) // Limit length
          .join(" → ")
        
        thinkingFlow = keyPhrases + (sentences.length > 2 ? " → ..." : "")
      } else {
        thinkingFlow = cleanThinking.substring(0, 100) + (cleanThinking.length > 100 ? "..." : "")
      }
    }

    return {
      thinking: isPlaceholder ? null : thinking,
      response,
      isThinkingPlaceholder: isPlaceholder,
      thinkingFlow: isPlaceholder ? undefined : thinkingFlow
    }
  }

  // Handle incomplete thinking block (live streaming)
  if (incompleteMatch) {
    const thinkingContent = incompleteMatch[1]
    const beforeThinking = content.substring(0, content.indexOf('◁think▷'))
    
    return {
      thinking: thinkingContent, // Keep all the thinking content for live display
      response: beforeThinking,
      isThinkingPlaceholder: false,
      thinkingFlow: undefined // No flow for live thinking
    }
  }

  return {
    thinking: null,
    response: content,
    isThinkingPlaceholder: false,
    thinkingFlow: undefined
  }
}
