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
      className="m-0 flex h-full w-full flex-col bg-background"
      value={contentType}
    >
      {/* Workspace Selector Header */}
      <header className="shrink-0 border-b bg-card p-4">
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
            <Card className="p-6 border-dashed">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">No chats yet</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px]">
                    Start a conversation to see your chat history here
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* Settings Footer */}
      <footer className="shrink-0 border-t bg-card p-4">
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
