import { Chat } from "@/db/chats"

export type DataListType = Chat[]

export type DataItemType = Chat

export type DataUpdateFunctions = {
  chats: (
    id: string,
    data: Partial<Chat>
  ) => Promise<Chat>
}

export type DataStateUpdateFunctions = {
  chats: React.Dispatch<React.SetStateAction<Chat[]>>
}
