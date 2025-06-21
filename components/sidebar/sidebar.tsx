import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { SidebarContent } from "./sidebar-content"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { MessageCircle } from "lucide-react"

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  const { chats } = useContext(MayuraContext)

  const getContentData = (contentType: ContentType) => {
    return chats
  }

  return (
    <TabsContent
      className="bg-sidebar m-0 flex size-full flex-col"
      value={contentType}
    >
      {/* Dark Modern Header */}
      <header className="bg-sidebar border-sidebar-border shrink-0 border-b p-6">
        <div className="flex items-center gap-3">
          <div className="rounded bg-violet-600 p-2">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <h1
            className="text-sidebar-foreground cursor-pointer text-lg font-semibold transition-opacity hover:opacity-80"
            onClick={() => (window.location.href = "/")}
          >
            Mayura (beta)
          </h1>
        </div>
      </header>

      {/* Chat History Section */}
      <section className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <SidebarContent
            contentType={contentType}
            data={getContentData(contentType)}
          />

          {/* Dark Empty State */}
          {(!chats || chats.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted border-border max-w-xs rounded-lg border p-8">
                <MessageCircle
                  className="text-muted-foreground mx-auto mb-6 size-16"
                  strokeWidth={1.5}
                />
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  No chats yet
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Start a conversation to see your chat history here
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dark Settings Footer */}
      <footer className="border-sidebar-border shrink-0 border-t p-6">
        <div className="flex justify-start">
          <WithTooltip
            display={
              <div className="text-sm font-medium">
                Profile Settings
              </div>
            }
            trigger={<ProfileSettings />}
          />
        </div>
      </footer>
    </TabsContent>
  )
}
