"use client"

import { Button } from "@/components/ui/button"
import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="focus-ring hover:bg-interactive-hover transition-smooth size-8 rounded-lg"
        disabled
      >
        <IconSun size={20} className="text-text-secondary" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="focus-ring hover:bg-interactive-hover transition-smooth size-8 rounded-lg"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <IconSun
          size={20}
          className="text-text-secondary hover:text-text-primary transition-smooth"
        />
      ) : (
        <IconMoon
          size={20}
          className="text-text-secondary hover:text-text-primary transition-smooth"
        />
      )}
    </Button>
  )
}
