import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { chatMessages, isGenerating, selectedWorkspace } =
    useContext(ChatbotUIContext)

  const { handleSendMessage, handleStopMessage } = useChatHandler()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [textareaRef.current?.value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!selectedWorkspace) return
    if (!textareaRef.current) return
    if (!textareaRef.current.value) return
    if (isGenerating) return

    const content = textareaRef.current.value
    textareaRef.current.value = ""

    handleSendMessage(content, chatMessages, false)
  }

  return (
    <div className="bg-background relative flex w-full grow flex-row rounded-xl border px-4 py-2">
      <Textarea
        ref={textareaRef}
        placeholder="Message..."
        className="bg-background min-h-[24px] w-full resize-none border-none px-2 py-[5px] focus-visible:ring-0 focus-visible:ring-offset-0"
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center justify-end">
        {isGenerating ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleStopMessage}
          >
            <IconPlayerStop size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleSubmit}
          >
            <IconSend size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
