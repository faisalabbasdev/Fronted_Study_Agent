import Link from "next/link"
import { ArrowRight, BookOpen, Brain, Clock3, FileText, Target } from "lucide-react"

const modes = [
  { slug: "beginner", title: "Learn a concept", label: "BEGINNER MODE", description: "Ask for a clear explanation and build understanding step by step.", icon: BookOpen },
  { slug: "practice", title: "Practice actively", label: "PRACTICE MODE", description: "Work through questions and use feedback to strengthen your understanding.", icon: Brain },
  { slug: "exam", title: "Prepare under time", label: "EXAM MODE", description: "Use a timed study session to practice recalling concepts with focus.", icon: Clock3 },
]

export default function StudyModesPage() {
  return (
    <main className="tayyar-modes-page tayyar-subpage">
      <section className="tayyar-modes-hero">
        <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> PICK A WAY TO PRACTICE</p>
        <h1>Study with<br /><span>more intention.</span></h1>
        <p>Choose a learning mode for a focused chat, or build a subject quiz from your materials and practice history.</p>
      </section>
      <section className="tayyar-mode-grid" aria-label="Study modes">
        {modes.map((mode, index) => { const Icon = mode.icon; return <article key={mode.slug} className={`tayyar-mode-card ${index === 1 ? "is-featured" : ""}`}>
          <div className="tayyar-mode-top"><span className="tayyar-icon-square"><Icon /></span><span>{mode.label}</span></div>
          <h2>{mode.title}</h2><p>{mode.description}</p>
          <Link href={`/chat?mode=${mode.slug}`} className="tayyar-mode-link">Open {mode.slug} chat <ArrowRight /></Link>
        </article> })}
      </section>
      <section className="tayyar-mode-actions"><div><p className="tayyar-mini-label">PERSONALIZED QUIZ PRACTICE</p><h2>Bring your subject<br /><span>into the session.</span></h2><p>Use material, topic, weak-topic, mistake, exam, or daily practice modes from quiz setup.</p></div><Link href="/quiz-setup" className="tayyar-button-light">Build a quiz <ArrowRight /></Link><Link href="/dashboard" className="tayyar-mode-secondary"><Target /> Review my progress</Link></section>
      <p className="tayyar-mode-note"><FileText /> Material-based questions rely on your uploaded PDFs. Sources are shown when a page reference is available.</p>
    </main>
  )
}
