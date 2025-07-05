"use client"

import { updateUserPassword } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog"
import { Input } from "../ui/input"
import { toast } from "sonner"

interface ChangePasswordProps {}

export const ChangePassword: FC<ChangePasswordProps> = () => {
  const router = useRouter()

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleResetPassword = async () => {
    if (!newPassword) {
      return toast.error("Please enter your new password.")
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long.")
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.")
    }

    try {
      // Note: Firebase updatePassword requires the user to be recently authenticated
      // For a more complete implementation, you might want to require re-authentication
      await updateUserPassword(newPassword)

      toast.success("Password changed successfully.")
      return router.push("/login")
    } catch (error: any) {
      console.error(error)
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Please log out and log back in to change your password.")
      } else {
        toast.error("Failed to change password. Please try again.")
      }
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="h-[240px] w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <Input
          id="password"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          minLength={6}
        />

        <Input
          id="confirmPassword"
          placeholder="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          minLength={6}
        />

        <DialogFooter>
          <Button
            onClick={handleResetPassword}
            disabled={
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
          >
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
