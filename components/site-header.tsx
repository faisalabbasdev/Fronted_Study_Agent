"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import ThemeToggle from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Menu, X, BookOpen, Brain, Zap } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import UserDropdown from "./user-dropdown"
import Image from "next/image"
// Navigation items that are always visible
const publicNav = [
  
  { href: "#about", label: "About", scroll: true },
  { href: "#pricing", label: "Pricing", scroll: true },
]

// Navigation items for authenticated users
const authNav = [
  { href: "/dashboard", label: "Dashboard" },
]

// Navigation items for non-authenticated users
const guestNav = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
]

export default function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full overflow-visible">
        <div className="flex h-14 sm:h-16 items-center justify-between overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image 
                src="/studymode.png" 
                alt="Study Mode Agent" 
                width={70} 
                height={70} 
                className="object-contain w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                priority
              />
            </div>
            <div className="flex flex-col ml-2 sm:ml-3">
              <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text leading-tight">
                Study Mode Agent
              </span>
              <span className="text-xs sm:text-xs text-muted-foreground -mt-0.5 sm:-mt-1 leading-tight">
                AI-Powered Learning
              </span>
            </div>
          </Link>

                 {/* Desktop Navigation */}
                 <nav className="hidden lg:flex items-center gap-1">
                   {/* Public navigation items (always visible) */}
                   {publicNav.map((item) => {
                     const active = pathname === item.href
                     const isScrollLink = item.scroll

                     return (
                       <Link
                         key={item.href}
                         href={item.href}
                         onClick={(e) => {
                           if (isScrollLink) {
                             e.preventDefault()
                             // If we're not on the home page, navigate there first
                             if (pathname !== '/') {
                               router.push(`/${item.href}`)
                             } else {
                               // If we're on the home page, scroll to the section
                               const element = document.querySelector(item.href)
                               if (element) {
                                 element.scrollIntoView({ 
                                   behavior: 'smooth',
                                   block: 'start'
                                 })
                               }
                             }
                           }
                         }}
                         className={cn(
                           "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group cursor-pointer",
                           active
                             ? "bg-primary text-primary-foreground shadow-sm"
                             : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                         )}
                       >
                         {item.label}
                       </Link>
                     )
                   })}

                   {/* Authenticated user navigation */}
                   {isAuthenticated && authNav.map((item) => {
                     const active = pathname === item.href
                     const isDashboard = item.href === "/dashboard"

                     return (
                       <Link
                         key={item.href}
                         href={item.href}
                         onClick={(e) => {
                           e.preventDefault()
                           router.push(item.href)
                         }}
                         className={cn(
                           "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group cursor-pointer",
                           active
                             ? "bg-primary text-primary-foreground shadow-sm"
                             : isDashboard
                             ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 border border-primary/20"
                             : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                         )}
                       >
                         {item.label}
                         {isDashboard && (
                           <Zap className="inline-block ml-1 h-3 w-3" />
                         )}
                       </Link>
                     )
                   })}
                   
                   {/* User Menu */}
                   {isAuthenticated ? (
                     <div className="pl-2 relative z-40">
                       <UserDropdown />
                     </div>
                   ) : (
                     <div className="flex items-center gap-1 pl-2">
                       {guestNav.map((item) => (
                         <Link
                           key={item.href}
                           href={item.href}
                           onClick={(e) => {
                             e.preventDefault()
                             router.push(item.href)
                           }}
                           className={cn(
                             "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer",
                             item.href === "/signup"
                               ? "bg-primary text-primary-foreground hover:bg-primary/90"
                               : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                           )}
                         >
                           {item.label}
                         </Link>
                       ))}
                     </div>
                   )}
                   
                   <div className="pl-2">
                     <ThemeToggle />
                   </div>
                 </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-muted/60 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

               {/* Mobile Navigation */}
               {isMobileMenuOpen && (
                 <div className="lg:hidden border-t bg-background/95 backdrop-blur-md shadow-lg w-full">
                   <div className="px-4 pt-3 pb-4 sm:pt-4 sm:pb-6 space-y-1 sm:space-y-2 w-full">
                     {/* Public navigation items (always visible) */}
                     {publicNav.map((item) => {
                       const active = pathname === item.href
                       const isScrollLink = item.scroll

                       return (
                         <Link
                           key={item.href}
                           href={item.href}
                           onClick={(e) => {
                             if (isScrollLink) {
                               e.preventDefault()
                               // If we're not on the home page, navigate there first
                               if (pathname !== '/') {
                                 router.push(`/${item.href}`)
                               } else {
                                 // If we're on the home page, scroll to the section
                                 const element = document.querySelector(item.href)
                                 if (element) {
                                   element.scrollIntoView({ 
                                     behavior: 'smooth',
                                     block: 'start'
                                   })
                                 }
                               }
                             }
                             setIsMobileMenuOpen(false)
                           }}
                           className={cn(
                             "block px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-colors cursor-pointer",
                             active
                               ? "bg-primary text-primary-foreground"
                               : "text-foreground hover:text-foreground hover:bg-muted/60",
                           )}
                         >
                           {item.label}
                         </Link>
                       )
                     })}

                     {/* Authenticated user navigation */}
                     {isAuthenticated && authNav.map((item) => {
                       const active = pathname === item.href
                       const isDashboard = item.href === "/dashboard"

                       return (
                         <Link
                           key={item.href}
                           href={item.href}
                           onClick={(e) => {
                             e.preventDefault()
                             router.push(item.href)
                             setIsMobileMenuOpen(false)
                           }}
                           className={cn(
                             "block px-4 py-3 text-base font-medium rounded-lg transition-colors cursor-pointer",
                             active
                               ? "bg-primary text-primary-foreground"
                               : isDashboard
                               ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 border border-primary/20"
                               : "text-foreground hover:text-foreground hover:bg-muted/60",
                           )}
                         >
                           <div className="flex items-center gap-2">
                             {item.label}
                             {isDashboard && (
                               <Zap className="h-4 w-4" />
                             )}
                           </div>
                         </Link>
                       )
                     })}
                     
                     {/* Mobile User Menu */}
                     {isAuthenticated ? (
                       <div className="border-t  pt-4 mt-4 overflow-visible">
                         <div className="px-4 py-2 relative z-40 overflow-visible">
                           <UserDropdown />
                         </div>
                       </div>
                     ) : (
                       <div className="border-t pt-4 mt-4 space-y-2">
                         {guestNav.map((item) => (
                           <Link
                             key={item.href}
                             href={item.href}
                             onClick={(e) => {
                               e.preventDefault()
                               router.push(item.href)
                               setIsMobileMenuOpen(false)
                             }}
                             className={cn(
                               "block px-4 py-3 text-base font-medium rounded-lg transition-colors cursor-pointer",
                               item.href === "/signup"
                                 ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                 : "text-foreground hover:text-foreground hover:bg-muted/60"
                             )}
                           >
                             {item.label}
                           </Link>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
               )}
      </div>
    </header>
  )
}
