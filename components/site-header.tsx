"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import ThemeToggle from "./theme-toggle"

const links = [
  { href: "/about", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 28)
    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  if (["/login", "/signup", "/dashboard"].includes(pathname)) return null

  return (
    <header className={`tayyar-site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="tayyar-nav-pill">
        <Link href="/" className="tayyar-brand" aria-label="Tayyar home">
          <span className="tayyar-brand-glyph">T</span>
          <span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span>
        </Link>
        <nav className="tayyar-desktop-links" aria-label="Main navigation">
          {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="tayyar-nav-actions">
          <ThemeToggle />
          {isAuthenticated ? <>
            <Link href="/dashboard" className="tayyar-signin-link">{user?.full_name?.split(" ")[0] || "Dashboard"}</Link>
            <button type="button" onClick={logout} className="tayyar-nav-cta"><LogOut className="h-4 w-4" /><span>Sign out</span></button>
          </> : <>
            <Link href="/login" className="tayyar-signin-link">Sign in</Link>
            <Link href="/signup" className="tayyar-nav-cta">Start studying <span aria-hidden="true">→</span></Link>
          </>}
          <button type="button" className="tayyar-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="tayyar-mobile-links" aria-label="Mobile navigation">
          {links.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          {isAuthenticated ? <><Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link><button type="button" onClick={() => { setMenuOpen(false); logout() }}><LogOut />Sign out</button></> : <><Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link><Link href="/signup" className="is-cta" onClick={() => setMenuOpen(false)}>Start studying →</Link></>}
        </nav>}
      </div>
    </header>
  )
}
