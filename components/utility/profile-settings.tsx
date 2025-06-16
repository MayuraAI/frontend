import { MayuraContext } from "@/context/context"
import { supabase } from "@/lib/supabase/browser-client"
import { IconLogout, IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FC, useContext, useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"

interface ProfileSettingsProps {}

export const ProfileSettings: FC<ProfileSettingsProps> = ({}) => {
  const { profile } = useContext(MayuraContext)
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
    return
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="focus-ring hover:bg-interactive-hover transition-smooth rounded-lg"
        >
          <IconUser size={24} className="text-text-primary" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="bg-bg-secondary border-border-color flex flex-col justify-between"
        side="left"
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-text-primary flex items-center justify-between space-x-2">
              <div>User Profile</div>

              <Button
                tabIndex={-1}
                className="bg-destructive hover:bg-destructive/90 text-xs text-white"
                size="sm"
                onClick={handleSignOut}
              >
                <IconLogout className="mr-1" size={20} />
                Logout
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-text-primary">Display Name</Label>
              <div className="bg-bg-tertiary border-border-color text-text-primary rounded-md border p-3">
                {profile?.display_name || "Not set"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-text-primary">Username</Label>
              <div className="bg-bg-tertiary border-border-color text-text-primary rounded-md border p-3">
                {profile?.username || "Not set"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-text-primary">Profile Instructions</Label>
              <div className="bg-bg-tertiary border-border-color text-text-primary min-h-[80px] rounded-md border p-3">
                {profile?.profile_context || "No instructions set"}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
