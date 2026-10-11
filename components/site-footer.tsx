import Link from "next/link"
import { Check } from "lucide-react"
import BrandLogo from "./brand-logo"

export default function SiteFooter() {
  return <footer className="tayyar-footer">
    <div className="tayyar-footer-main">
      <div>
        <Link href="/" className="tayyar-brand" aria-label="Tayyar home"><BrandLogo className="h-16 w-48 object-contain" /></Link>
        <p>Study from your own materials.<br />Know what to practice next.</p>
        <span className="tayyar-footer-tag"><Check /> Built around your coursework</span>
      </div>
      <div><p className="tayyar-mini-label">PRODUCT</p><Link href="/about">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link></div>
      <div><p className="tayyar-mini-label">YOUR SPACE</p><Link href="/signup">Create account</Link><Link href="/login">Sign in</Link><Link href="/dashboard">Dashboard</Link></div>
    </div>
    <div className="tayyar-footer-bottom"><span>© 2026 Tayyar · AI Exam Preparation</span><span>Practice readiness is an estimate, not an exam mark prediction.</span></div>
  </footer>
}
