"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Shield, 
  Bell, 
  HelpCircle,
  CreditCard,
  BookOpen,
  BarChart3,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface UserDropdownProps {
  className?: string
}

export default function UserDropdown({ className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle escape key to close dropdown
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  // Handle theme mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getThemeLabel = () => {
    if (!mounted) return "Theme"
    if (theme === "light") return "Light"
    if (theme === "dark") return "Dark"
    return "System"
  }

  if (!user) return null

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* User Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-2 sm:px-3 py-2 h-auto hover:bg-muted/60 transition-colors max-w-full min-w-0"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
          <AvatarImage src="" alt={user.full_name || user.username} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-medium">
            {(user.full_name || user.username).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-left min-w-0 flex-1">
          <div className="text-sm font-medium leading-none truncate">
            {user.full_name || user.username}
          </div>
          <div className="text-xs text-muted-foreground truncate hidden sm:block">
            {user.email}
          </div>
        </div>
        <ChevronDown 
          className={cn(
            "h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )} 
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-64 bg-card border border-border rounded-lg shadow-xl animate-in slide-in-from-top-2 duration-200 z-[60] max-w-[calc(100vw-1rem)] sm:max-w-none overflow-hidden max-h-[calc(100vh-8rem)] sm:max-h-80">
          {/* User Info Header */}
          <div className="px-3 sm:px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <AvatarImage src="" alt={user.full_name || user.username} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                  {(user.full_name || user.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user.full_name || user.username}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {/* Profile */}
            {/* <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link> */}

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>Dashboard</span>
            </Link>

            {/* Study Sessions */}
            <Link
              href="/study-modes"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>Study Sessions</span>
            </Link>

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Settings */}
            {/* <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </Link> */}

            {/* Notifications */}
            {/* <Link
              href="/notifications"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span>Notifications</span>
            </Link> */}

            {/* Billing */}
            <Link
              href="/pricing"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Billing</span>
            </Link>


          
            {/* Help */}
            {/* <Link
              href="/help"
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted/60 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span>Help & Support</span>
            </Link> */}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
