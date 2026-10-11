import Link from "next/link"
import { ArrowRight, BookOpen, Check, Crown, Sparkles, Target } from "lucide-react"
import SiteFooter from "@/components/site-footer"

const plans = [
  { id: "starter", name: "Starter", price: "1,000", icon: BookOpen, description: "Build a steady study routine around your course materials.", features: ["PDF study material library", "Material and topic quizzes", "Quiz explanations and history", "Practice progress overview"] },
  { id: "plus", name: "Plus", price: "1,500", icon: Target, description: "Turn your results into focused practice for your weak areas.", features: ["Everything in Starter", "Weak-topic practice", "Mistake book and concept review", "Topic mastery estimates", "Daily practice recommendations"], popular: true },
  { id: "exam-prep", name: "Exam Prep", price: "2,000", icon: Crown, description: "Organize revision around exam dates and past-paper topics.", features: ["Everything in Plus", "Past-paper topic analysis", "Exam-date-aware practice", "Exam-style quiz mode", "Readiness and progress insights"] },
]

export default function PricingPage() {
  return <div className="tayyar-marketing-page tayyar-pricing-page">
    <section className="tayyar-pricing-heading">
      <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> SIMPLE STUDENT PLANS</p>
      <h1>Choose your<br /><span>study pace.</span></h1>
      <p>Three monthly packages in Pakistani rupees, designed around how much structure and exam practice you need.</p>
    </section>
    <section className="tayyar-pricing-cards tayyar-plan-cards" aria-label="Monthly Tayyar plans">
      {plans.map(({ id, name, price, icon: Icon, description, features, popular }) => <article key={id} className={`tayyar-pricing-card tayyar-plan-card ${popular ? "is-featured" : ""}`}>
        {popular && <span className="tayyar-pricing-popular">MOST POPULAR</span>}
        <div className="tayyar-pricing-kicker"><span />{name.toUpperCase()}</div>
        <div className="tayyar-pricing-icon"><Icon /></div>
        <h2>{name}</h2><p className="tayyar-pricing-description">{description}</p>
        <div className="tayyar-plan-price"><strong>Rs {price}</strong><span>PKR / month</span></div>
        <ul>{features.map((feature) => <li key={feature}><Check />{feature}</li>)}</ul>
        <Link href="/signup" className={`tayyar-pricing-cta ${popular ? "is-bright" : ""}`}>Get started <ArrowRight /></Link>
      </article>)}
    </section>
    <p className="tayyar-pricing-disclaimer"><Sparkles /> Plan prices are shown as requested. Online payments and plan-based access controls are not connected in the current app yet.</p>
    <SiteFooter />
  </div>
}
