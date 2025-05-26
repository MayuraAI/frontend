import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  // First check if we're authenticated
  const session = (await supabase.auth.getSession()).data.session
  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data: homeWorkspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .eq("is_home", true)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Home workspace not found, create one
      const newWorkspace = await createWorkspace({
        user_id: userId,
        name: "Home",
        description: "Your home workspace",
        is_home: true,
        include_profile_context: true,
        include_workspace_instructions: true,
        instructions: "You are a helpful AI assistant."
      })
      return newWorkspace.id
    }
    console.error("Error fetching home workspace:", error)
    throw new Error(`Failed to fetch home workspace: ${error.message}`)
  }

  return homeWorkspace.id
}

export const getWorkspaceById = async (workspaceId: string) => {
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single()

  if (error) {
    console.error("Error fetching workspace:", error)
    throw new Error(`Failed to fetch workspace: ${error.message}`)
  if (error) {
    console.error("Error fetching workspace:", error)
    throw new Error(`Failed to fetch workspace: ${error.message}`)
  }

  return workspace
}

export const getWorkspacesByUserId = async (userId: string) => {
  // First check if we're authenticated and the user ID matches
  const session = (await supabase.auth.getSession()).data.session
  if (!session) {
    throw new Error("Not authenticated")
  }

  if (userId !== session.user.id) {
    throw new Error("Cannot access workspaces for another user")
  }

  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    if (error.code === "PGRST116") {
      // No workspaces found, create home workspace
      const homeWorkspace = await createWorkspace({
        user_id: userId,
        name: "Home",
        description: "Your home workspace",
        is_home: true,
        include_profile_context: true,
        include_workspace_instructions: true,
        instructions: "You are a helpful AI assistant."
      })
      return [homeWorkspace]
    }
    console.error("Error fetching workspaces:", error)
    throw new Error(`Failed to fetch workspaces: ${error.message}`)
  }

  if (!workspaces || workspaces.length === 0) {
    // No workspaces found, create home workspace
    const homeWorkspace = await createWorkspace({
      user_id: userId,
      name: "Home",
      description: "Your home workspace",
      is_home: true,
      include_profile_context: true,
      include_workspace_instructions: true,
      instructions: "You are a helpful AI assistant."
    })
    return [homeWorkspace]
  }

  return workspaces
}

export const createWorkspace = async (
  workspace: TablesInsert<"workspaces">
) => {
  // First check if we're authenticated
  const session = (await supabase.auth.getSession()).data.session
  if (!session) {
    throw new Error("Not authenticated")
  }

  console.log("Debug - Auth Check:", {
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
      console.error("RLS Error creating workspace:", error)
      throw new Error(
        "Not authorized to create workspace. Please try logging out and back in."
      )
    }
    throw new Error(error.message)
  }

  return createdWorkspace
}

export const updateWorkspace = async (
  workspaceId: string,
  workspace: TablesUpdate<"workspaces">
) => {
  const { data: updatedWorkspace, error } = await supabase
    .from("workspaces")
    .update(workspace)
    .eq("id", workspaceId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedWorkspace
}

export const deleteWorkspace = async (workspaceId: string) => {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const getChatsByWorkspaceId = async (workspaceId: string) => {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching chats:", error)
    throw new Error(`Failed to fetch chats: ${error.message}`)
  }

  if (!chats) {
    console.error("No chats found for workspace:", workspaceId)
    return []
  }

  return chats
}

export const getChatsByWorkspaceId = async (workspaceId: string) => {
  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching chats:", error)
    throw new Error(`Failed to fetch chats: ${error.message}`)
  }

  if (!chats) {
    console.error("No chats found for workspace:", workspaceId)
    return []
  }

  return chats
}
