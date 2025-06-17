import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
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
      className="bg-sidebar border-r-3 m-0 flex size-full flex-col border-black"
      value={contentType}
    >
      {/* App Header with Neobrutalist Logo */}
      <header className="bg-sidebar border-b-3 shrink-0 border-black p-6">
          <div className="flex items-center gap-3">
            {/* <div className="border-2 border-black bg-black p-3 shadow-[3px_3px_0px_0px_black]">
              <span className="font-mono text-lg font-bold text-white">M</span>
            </div> */}
            <h1 className="font-fleur">Mayura</h1>
          </div>
        <div className="mt-6 flex items-center justify-between">
          <WorkspaceSwitcher />
          <WorkspaceSettings />
        </div>
      </header>

      {/* Chat History Section */}
      <section className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <SidebarContent
            contentType={contentType}
            data={getContentData(contentType)}
          />

          {/* Enhanced Empty State with Neobrutalist styling */}
          {(!chats || chats.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="container-neobrutalist max-w-xs p-8">
                <MessageCircle className="mx-auto mb-6 size-16 text-black" strokeWidth={3} />
                <h3 className="mb-4 font-sans text-xl font-black text-black">NO CHATS YET</h3>
                <p className="font-mono text-sm font-bold leading-relaxed text-black">
                  START A CONVERSATION TO SEE YOUR CHAT HISTORY HERE
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Settings Footer with Neobrutalist border */}
      <footer className="border-t-3 shrink-0 border-black p-6">
        <div className="flex justify-start">
          <WithTooltip
            display={<div className="font-sans font-bold uppercase">PROFILE SETTINGS</div>}
            trigger={<ProfileSettings />}
          />
        </div>
      </footer>
    </TabsContent>
  )
}
