import { createClient } from "@/lib/supabase/server"
import { TablesInsert } from "@/supabase/types"
import { cookies } from "next/headers"

export const createServerWorkspace = async (
  workspace: TablesInsert<"workspaces">
) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current session
  const session = (await supabase.auth.getSession()).data.session
  if (!session) {
    throw new Error("Not authenticated")
  }

  console.log("Debug - Server Auth Check:", {
    sessionUserId: session.user.id,
    workspaceUserId: workspace.user_id,
    isMatch: workspace.user_id === session.user.id
  })

  // Verify the user_id matches the authenticated user
  if (workspace.user_id !== session.user.id) {
    throw new Error(
      `Cannot create workspace for another user. Session user: ${session.user.id}, Workspace user: ${workspace.user_id}`
    )
  }

  const { data: createdWorkspace, error } = await supabase
    .from("workspaces")
    .insert([workspace])
    .select("*")
    .single()

  if (error) {
    if (error.message.includes("row-level security")) {
      throw new Error(
        "Not authorized to create workspace. Please try logging out and back in."
      )
    }
    throw new Error(error.message)
  }

  return createdWorkspace
}

export const getServerHomeWorkspace = async (userId: string) => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: homeWorkspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .eq("is_home", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No home workspace found, create one
      return await createServerWorkspace({
        user_id: userId,
        name: "Home",
        default_prompt: "You are a helpful AI assistant.",
        is_home: true,
        include_profile_context: true,
        include_workspace_instructions: true,
        instructions: "You are a helpful AI assistant.",
        sharing: "private"
      })
    }
    throw new Error(`Failed to fetch home workspace: ${error.message}`)
  }

  return homeWorkspace
}
