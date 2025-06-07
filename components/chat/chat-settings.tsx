import { MayuraContext } from "@/context/context"
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import useHotkey from "@/lib/hooks/use-hotkey"
import { LLMID, ModelProvider } from "@/types"
import { IconAdjustmentsHorizontal } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { ChatSettingsForm } from "../ui/chat-settings-form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface ChatSettingsProps {}

export const ChatSettings: FC<ChatSettingsProps> = ({}) => {
  useHotkey("i", () => handleClick())

  const { chatSettings, setChatSettings } = useContext(MayuraContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click()
    }
  }

  useEffect(() => {
    if (!chatSettings) return

    setChatSettings({
      ...chatSettings,
      temperature: Math.min(
        chatSettings.temperature,
        CHAT_SETTING_LIMITS[chatSettings.model as LLMID]?.MAX_TEMPERATURE || 1
      ),
      contextLength: Math.min(
        chatSettings.contextLength,
        CHAT_SETTING_LIMITS[chatSettings.model as LLMID]?.MAX_CONTEXT_LENGTH ||
          4096
      )
    })
  }, [chatSettings?.model])

  if (!chatSettings) return null

  // For now, we'll just show the current model since the full model list needs to be fetched from context
  const currentModel = {
    modelId: chatSettings.model as LLMID,
    modelName: chatSettings.model,
    provider: "custom" as ModelProvider
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          ref={buttonRef}
          className="flex items-center space-x-2"
          variant="ghost"
        >
          <div className="max-w-[120px] truncate text-lg sm:max-w-[300px] lg:max-w-[500px]">
            {currentModel.modelName}
          </div>

          <IconAdjustmentsHorizontal size={28} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="bg-background border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg border-2 p-6 sm:w-[350px] md:w-[400px] lg:w-[500px] dark:border-none"
        align="end"
      >
        <ChatSettingsForm
          chatSettings={chatSettings}
          onChangeChatSettings={setChatSettings}
        />
      </PopoverContent>
    </Popover>
  )
}
