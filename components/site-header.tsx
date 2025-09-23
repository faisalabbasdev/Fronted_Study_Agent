"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import ThemeToggle from "./theme-toggle"

const nav = [
  { href: "/", label: "Home" },
  { href: "/study-modes", label: "Study Modes" },
  { href: "/chat", label: "Chat" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
]

export default function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary/20 ring-1 ring-primary/40" aria-hidden />
            <span className="font-semibold tracking-tight">Study Agent</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pl-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
