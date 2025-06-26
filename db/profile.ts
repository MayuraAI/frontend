import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getProfileByUserId = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      try {
        // Generate a unique username
        const baseUsername = `user_${userId.slice(0, 8)}`
        let finalUsername = baseUsername
        let counter = 0

        // Ensure username is unique
        while (counter < 100) {
          const { data: existingUser } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", finalUsername)
            .single()

          if (!existingUser) break

          counter++
          finalUsername = `${baseUsername}_${counter}`
        }

        const newProfile = await createProfile({
          user_id: userId,
          username: finalUsername,
          display_name: "",
          profile_context: "",
          has_onboarded: false
        })

        return newProfile
      } catch (createError) {
        console.error("Error creating profile:", createError)

        // Fallback: try with timestamp-based username
        try {
          const fallbackProfile = await createProfile({
            user_id: userId,
            username: `user${Date.now()}`,
            display_name: "",
            profile_context: "",
            has_onboarded: false
          })

          return fallbackProfile
        } catch (fallbackError) {
          console.error("Fallback profile creation failed:", fallbackError)
          throw new Error(`Failed to create profile: ${fallbackError}`)
        }
      }
    }
    console.error("Error fetching profile:", error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return profile
}

export const getProfilesByUserId = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)

  if (!profiles) {
    throw new Error(error.message)
  }

  return profiles
}

export const createProfile = async (profile: TablesInsert<"profiles">) => {
  const { data: createdProfile, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdProfile
}

export const updateProfile = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedProfile
}

export const deleteProfile = async (profileId: string) => {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
