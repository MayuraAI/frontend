import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { IconChevronDown } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"

interface QuickSettingsProps {}

export const QuickSettings: FC<QuickSettingsProps> = ({}) => {
  const { t } = useTranslation()

  useHotkey("p", () => setIsOpen(prevState => !prevState))

  const { selectedWorkspace } = useContext(ChatbotUIContext)

  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger asChild className="max-w-[400px]">
        <Button variant="ghost" className="flex space-x-3 text-lg">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div>Quick Settings</div>
              <IconChevronDown />
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="space-y-1 overflow-auto p-2"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <Input
          ref={inputRef}
          placeholder={t("Search...")}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
