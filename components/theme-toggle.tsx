"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null
    const prefersDark =
      typeof window !== "undefined" ? window.matchMedia?.("(prefers-color-scheme: dark)").matches : false
    const dark = stored ? stored === "dark" : prefersDark
    document.documentElement.classList.toggle("dark", dark)
    setIsDark(dark)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden />
      <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
