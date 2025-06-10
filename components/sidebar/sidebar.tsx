import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { Card } from "../ui/card"
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
      className="bg-background m-0 flex size-full flex-col"
      value={contentType}
    >
      {/* Workspace Selector Header */}
      <header className="bg-card shrink-0 border-b p-4">
        <div className="flex items-center justify-between">
          <WorkspaceSwitcher />
          <WorkspaceSettings />
        </div>
      </header>

      {/* Chat History Section */}
      <section className="flex-1 overflow-hidden px-4 pt-4">
        <div className="h-full overflow-y-auto">
          <SidebarContent
            contentType={contentType}
            data={getContentData(contentType)}
          />
        </div>

        {/* Empty State */}
        {(!chats || chats.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Card className="border-dashed p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
                  <MessageCircle className="text-muted-foreground size-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground font-medium">No chats yet</h3>
                  <p className="text-muted-foreground max-w-[200px] text-sm">
                    Start a conversation to see your chat history here
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Settings Footer */}
      <footer className="bg-card shrink-0 border-t p-4">
        <div className="flex justify-start">
          <WithTooltip
            display={<div>Profile Settings</div>}
            trigger={<ProfileSettings />}
          />
        </div>
      </footer>
    </TabsContent>
  )
}
