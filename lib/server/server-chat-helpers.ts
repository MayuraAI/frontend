import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { cookies } from "next/headers"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function getServerProfile() {
  const cookieStore = cookies()
  
  // Get Firebase ID token from cookies
  const firebaseToken = cookieStore.get('firebase-token')?.value
  
  if (!firebaseToken) {
    throw new Error("Firebase token not found")
  }

  try {
    // Call our backend API to get current user's profile
    const response = await fetch(`${API_BASE_URL}/v1/profiles/current`, {
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`)
    }

    const profile = await response.json()
    
    if (!profile) {
      throw new Error("Profile not found")
    }

    const profileWithKeys = addApiKeysToProfile(profile)

    return profileWithKeys
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw new Error("Failed to fetch profile")
  }
}

function addApiKeysToProfile(profile: any) {
  const apiKeys = {
    [VALID_ENV_KEYS.OPENAI_API_KEY]: "openai_api_key",
    [VALID_ENV_KEYS.ANTHROPIC_API_KEY]: "anthropic_api_key",
    [VALID_ENV_KEYS.GOOGLE_GEMINI_API_KEY]: "google_gemini_api_key",
    [VALID_ENV_KEYS.MISTRAL_API_KEY]: "mistral_api_key",
    [VALID_ENV_KEYS.GROQ_API_KEY]: "groq_api_key",
    [VALID_ENV_KEYS.PERPLEXITY_API_KEY]: "perplexity_api_key",
    [VALID_ENV_KEYS.AZURE_OPENAI_API_KEY]: "azure_openai_api_key",
    [VALID_ENV_KEYS.OPENROUTER_API_KEY]: "openrouter_api_key",

    [VALID_ENV_KEYS.OPENAI_ORGANIZATION_ID]: "openai_organization_id",

    [VALID_ENV_KEYS.AZURE_OPENAI_ENDPOINT]: "azure_openai_endpoint",
    [VALID_ENV_KEYS.AZURE_GPT_35_TURBO_NAME]: "azure_openai_35_turbo_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_VISION_NAME]: "azure_openai_45_vision_id",
    [VALID_ENV_KEYS.AZURE_GPT_45_TURBO_NAME]: "azure_openai_45_turbo_id",
    [VALID_ENV_KEYS.AZURE_EMBEDDINGS_NAME]: "azure_openai_embeddings_id"
  }

  for (const [envKey, profileKey] of Object.entries(apiKeys)) {
    if (process.env[envKey]) {
      ;(profile as any)[profileKey] = process.env[envKey]
    }
  }

  return profile
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`${keyName} API Key not found`)
  }
}
