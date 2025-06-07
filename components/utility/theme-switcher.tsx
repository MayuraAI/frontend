import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { FC, useEffect, useState } from "react"
import { Button } from "../ui/button"

interface ThemeSwitcherProps {}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (theme: "dark" | "light") => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  if (!mounted) {
    return (
      <Button
        className="focus-ring p-2 rounded-lg hover:bg-interactive-hover transition-smooth bg-bg-tertiary border border-border-color"
        variant="ghost"
        disabled
      >
        <IconSun size={20} className="text-text-secondary mr-2" />
        <span className="text-text-primary">Light</span>
      </Button>
    )
  }

  return (
    <Button
      className="focus-ring p-2 rounded-lg hover:bg-interactive-hover transition-smooth bg-bg-tertiary border border-border-color justify-start"
      variant="ghost"
      onClick={() => handleChange(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <IconMoon size={20} className="text-text-secondary mr-2" />
          <span className="text-text-primary">Dark</span>
        </>
      ) : (
        <>
          <IconSun size={20} className="text-text-secondary mr-2" />
          <span className="text-text-primary">Light</span>
        </>
      )}
    </Button>
  )
}
