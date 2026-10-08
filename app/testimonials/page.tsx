import Link from "next/link"
import { ArrowRight, BookOpen, ChartNoAxesCombined, FileText, Target } from "lucide-react"

const learningLoop = [
  { number: "01", icon: FileText, title: "Start with your coursework", description: "Attach lecture notes, slides, books, or past papers as PDFs to the subject you are studying." },
  { number: "02", icon: Target, title: "Practice where it matters", description: "Choose a topic, revisit a weak area, or test the concepts behind your previous mistakes." },
  { number: "03", icon: ChartNoAxesCombined, title: "Use progress to plan", description: "Review your topic practice estimates and the next-session recommendation based on your saved activity." },
]

export default function TestimonialsPage() {
  return (
    <main className="tayyar-proof-page tayyar-subpage">
      <section className="tayyar-subpage-hero">
        <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> BUILT AROUND YOUR STUDY HISTORY</p>
        <h1>Progress that<br /><span>shows what’s next.</span></h1>
        <p className="tayyar-subpage-lede">Tayyar connects course material, quiz answers, and review timing to help you make a more focused study plan.</p>
        <div className="tayyar-hero-buttons"><Link href="/signup" className="tayyar-button-light">Build your study space <ArrowRight /></Link><Link href="/about" className="tayyar-button-outline">How it works</Link></div>
      </section>
      <section className="tayyar-proof-loop">
        <div className="tayyar-proof-heading"><p className="tayyar-mini-label">A PRACTICE LOOP THAT LEARNS FROM YOUR ANSWERS</p><h2>Your next step comes<br /><span>from your last one.</span></h2></div>
        <div className="tayyar-proof-cards">{learningLoop.map((step) => { const Icon = step.icon; return <article key={step.number} className="tayyar-step-card"><div className="tayyar-step-card-top"><span className="tayyar-icon-square"><Icon /></span><strong>{step.number}</strong></div><h3>{step.title}</h3><p>{step.description}</p><div className="tayyar-step-card-foot"><span /><small>YOUR STUDY SPACE</small></div></article> })}</div>
        <div className="tayyar-proof-estimate"><BookOpen /><p><strong>Practice readiness is an estimate.</strong><span>It summarizes your recorded practice; it does not predict exam marks or guarantee an outcome.</span></p></div>
      </section>
    </main>
  )
}
