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
      className="bg-sidebar m-0 flex w-full flex-col size-full"
      value={contentType}
    >
      {/* Responsive Header */}
      <header className="bg-sidebar shrink-0 p-4 md:p-6 flex justify-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
          <img 
            src="/logo_512.png" 
            alt="Mayura Logo" 
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10"
          />
          <p className="flex-1 text-sidebar-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-opacity hover:opacity-80">
            Mayura 
          </p>
          <span className="text-xs sm:text-sm md:text-base font-semibold opacity-60 align-top ml-1">(beta)</span>
        </div>
      </header>

      {/* Chat History Section */}
      <section className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-3 md:p-4 lg:p-6">
          <SidebarContent
            contentType={contentType}
            data={getContentData(contentType)}
          />

          {/* Responsive Empty State */}
          {(!chats || chats.length === 0) && (
            <div className="flex flex-col items-center justify-center py-8 md:py-16 text-center">
              <div className="bg-muted border-border max-w-xs rounded-lg border p-4 md:p-8">
                <MessageCircle
                  className="text-muted-foreground mx-auto mb-4 md:mb-6 size-12 md:size-16"
                  strokeWidth={1.5}
                />
                <h3 className="text-foreground mb-2 md:mb-4 text-base md:text-lg font-semibold">
                  No chats yet
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  Start a conversation to see your chat history here
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Responsive Settings Footer */}
      <footer className="shrink-0 p-3 md:p-6">
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
