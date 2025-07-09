import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { SidebarContent } from "./sidebar-content"
import { WithTooltip } from "../ui/with-tooltip"
import { ProfileSettings } from "../utility/profile-settings"
import { ArrowRight, MessageCircle, Plus, UserPlus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"


interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  const { chats } = useContext(MayuraContext)
  const { user } = useAuth()
  const router = useRouter()

  const getContentData = (contentType: ContentType) => {
    return chats
  }

  return (
    <TabsContent
      className="bg-sidebar m-0 flex size-full w-full flex-col"
      value={contentType}
    >
      {/* Responsive Header */}
      <header className="bg-sidebar flex shrink-0 justify-center p-4 md:p-6">
        <div className="flex cursor-pointer items-center gap-2" onClick={() => (window.location.href = "/")}>
          <img 
            src="/logo_512.png" 
            alt="Mayura Logo" 
            className="size-6 sm:size-7 md:size-8 lg:size-10"
          />
          <div className="flex flex-1 items-center">
            <p className="text-sidebar-foreground text-xl font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-2xl md:text-3xl lg:text-4xl">
              Mayura 
            </p>
          </div>
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
            <div className="flex flex-col items-center justify-center py-8 text-center md:py-16">
              <div className="border-border max-w-xs rounded-lg border p-4 md:p-8">
                <MessageCircle
                  className="text-muted-foreground mx-auto mb-4 size-12 md:mb-6 md:size-16"
                  strokeWidth={1.5}
                />
                <h3 className="text-foreground mb-2 text-base font-semibold md:mb-4 md:text-lg">
                  No chats yet
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed md:text-sm">
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
          {user && !isAnonymousUser() ? (
            /* Show profile settings for authenticated users */
            <WithTooltip
              display={
                <div className="text-sm font-medium">
                  Profile Settings
                </div>
              }
              trigger={<ProfileSettings />}
            />
          ) : user && isAnonymousUser() ? (
            /* Show sign up button for anonymous users */
                <Button
                  onClick={() => router.push("/login")}
                  className="h-auto w-full justify-start gap-3 rounded-lg bg-violet-600 p-3 text-white"
                >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <p>Sign Up for More Features</p> <ArrowRight size={24} className="text-white" />
                </div>
                </Button>
          ) : null}
        </div>
      </footer>
    </TabsContent>
  )
}
