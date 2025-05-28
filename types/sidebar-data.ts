import { Tables } from "@/supabase/types"

export type DataListType = Tables<"chats">[]

export type DataItemType = Tables<"chats">

export type DataUpdateFunctions = {
  chats: (
    id: string,
    data: Partial<Tables<"chats">>
  ) => Promise<Tables<"chats">>
}

export type DataStateUpdateFunctions = {
  chats: React.Dispatch<React.SetStateAction<Tables<"chats">[]>>
}
