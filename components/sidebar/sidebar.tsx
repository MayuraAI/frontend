import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"

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
      className="m-0 flex size-full flex-col"
      value={contentType}
    >
      {/* Workspace Selector Header */}
      <header className="border-border-light border-b p-4">
        <div className="relative">
          <div className="flex items-center justify-between">
            <WorkspaceSwitcher />
            <WorkspaceSettings />
          </div>
        </div>
      </header>

      {/* Chat History Section */}
      <section className="mt-2 flex-1 overflow-hidden px-4">
        <div className="h-full overflow-y-auto">
          <SidebarContent
            contentType={contentType}
            data={getContentData(contentType)}
          />
        </div>
        
        {/* Empty State */}
        {(!chats || chats.length === 0) && (
          <div className="text-text-muted px-4 py-8 text-center">
            <div className="mb-3 opacity-50">
              <svg className="mx-auto size-12" 
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p className="text-sm">No chats in this workspace yet.</p>
            <p className="mt-1 text-xs">Start a conversation below!</p>
          </div>
        )}
      </section>

      {/* Settings Footer */}
      <footer className="border-border-light border-t p-4">
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
