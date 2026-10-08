import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, Check, FileText, Target } from "lucide-react"
import SiteFooter from "@/components/site-footer"

const included = [
  { icon: FileText, label: "Study materials", detail: "PDF notes, books, slides, and past papers" },
  { icon: BookOpen, label: "Focused practice", detail: "Material, topic, weak-topic, mistake, and exam-style quizzes" },
  { icon: Target, label: "Progress tools", detail: "Topic history, mistake review, and practice mastery estimates" },
  { icon: CalendarDays, label: "Study planning", detail: "Daily recommendations, review timing, and subject exam dates" },
]

export default function PricingPage() {
  return <div className="tayyar-marketing-page tayyar-pricing-page">
    <section className="tayyar-pricing-heading">
      <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> TAYYAR STUDY WORKSPACE</p>
      <h1>One workspace.<br /><span>What’s included.</span></h1>
      <p>See what’s included in Tayyar today. This project has no paid tiers or billing configured, so the page shows the current workspace without made-up prices.</p>
    </section>
    <section className="tayyar-pricing-cards" aria-label="Current Tayyar workspace">
      <article className="tayyar-pricing-card is-featured">
        <span className="tayyar-pricing-popular">CURRENT WORKSPACE</span>
        <div className="tayyar-pricing-kicker"><span /> ONE STUDY SPACE</div>
        <div className="tayyar-pricing-body">
          <div className="tayyar-pricing-summary">
            <div className="tayyar-pricing-icon"><BookOpen /></div>
            <h2>Everything for focused exam preparation.</h2>
            <p className="tayyar-pricing-description">Use your course materials, practice what needs work, and keep your progress together in one student workspace.</p>
            <div className="tayyar-pricing-included"><strong>Billing not configured</strong><span>All features currently available are part of this workspace.</span></div>
            <Link href="/signup" className="tayyar-pricing-cta is-bright">Create your study space <ArrowRight /></Link>
          </div>
          <ul className="tayyar-pricing-included-list">{included.map(({ icon: Icon, label, detail }) => <li key={label}><span className="tayyar-pricing-list-icon"><Icon /></span><span><strong>{label}</strong><small>{detail}</small></span><Check className="tayyar-pricing-list-check" /></li>)}</ul>
        </div>
      </article>
    </section>
    <SiteFooter />
  </div>
}
