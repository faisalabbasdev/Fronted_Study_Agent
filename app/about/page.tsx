import Link from "next/link"
import { ArrowRight, BookOpen, Brain, CalendarDays, Check, FileText, Target, UploadCloud } from "lucide-react"

const principles = [
  { icon: UploadCloud, number: "01", title: "Start with your material", body: "Upload lecture notes, books, slides, or past papers as PDFs and attach them to a subject." },
  { icon: Brain, number: "02", title: "Practice with context", body: "Generate questions from selected material, or focus on a topic and the concepts behind past mistakes." },
  { icon: Target, number: "03", title: "See what needs work", body: "Quiz history informs your topic-level practice estimates and keeps useful mistakes ready to review." },
  { icon: CalendarDays, number: "04", title: "Choose the next session", body: "Recommendations consider recent results, review timing, available materials, and your exam date." },
]

export default function AboutPage() {
  return <main className="tayyar-marketing-page tayyar-subpage">
    <section className="tayyar-subpage-hero">
      <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> THE TAYYAR STUDY LOOP</p>
      <h1>Less random practice.<br /><span>More useful revision.</span></h1>
      <p className="tayyar-subpage-lede">Tayyar connects your course PDFs, quiz history, and weak topics—so every practice session can help you decide what to study next.</p>
      <div className="tayyar-hero-buttons"><Link href="/signup" className="tayyar-button-light">Build your study space <ArrowRight /></Link><Link href="/pricing" className="tayyar-button-outline">Explore Tayyar</Link></div>
      <div className="tayyar-subpage-decoration" aria-hidden="true"><BookOpen /><span>YOUR COURSE MATERIAL</span><i /></div>
    </section>
    <section className="tayyar-proof-panel tayyar-subpage-proof"><p className="tayyar-mini-label">THREE QUESTIONS YOUR STUDY SPACE HELPS ANSWER</p><div className="tayyar-proof-grid"><div><strong>What</strong><span>do I know?</span></div><div><strong>Where</strong><span>am I getting stuck?</span></div><div><strong>What next?</strong><span>should I practice?</span></div><div><strong>Your data</strong><span>your course context</span></div></div></section>
    <section className="tayyar-steps-section tayyar-about-steps"><div className="tayyar-section-intro"><div><p className="tayyar-mini-label">A SIMPLE, PERSONAL LOOP</p><h2>From the first PDF<br />to <span>your next revision.</span></h2></div><p>Everything is organized around your subjects and the materials you actually use in class.</p></div>
      <div className="tayyar-step-cards tayyar-about-cards">{principles.map(({ icon: Icon, number, title, body }, i) => <article key={number} className={`tayyar-step-card step-${(i % 3) + 1}`}><div className="tayyar-step-card-top"><span className="tayyar-icon-square"><Icon /></span><strong>{number}</strong></div><h3>{title}</h3><p>{body}</p><div className="tayyar-step-card-foot"><span /><small>{["YOUR PDFS", "YOUR COURSE", "YOUR ANSWERS", "YOUR SCHEDULE"][i]}</small></div></article>)}</div>
    </section>
    <section className="tayyar-steps-section tayyar-about-note-section"><div className="tayyar-about-note-card"><div className="tayyar-icon-square"><Check /></div><div><p className="tayyar-mini-label">BUILT FOR DIFFERENT UNIVERSITIES</p><h2>Your program.<br /><span>Your semester.</span></h2><p>Add the university, program, semester, subjects, and exam dates that fit your studies. Tayyar is designed for students across different institutions and departments.</p><Link className="tayyar-text-link" href="/signup">Set up your study space <ArrowRight /></Link></div></div>
      <div className="tayyar-about-source"><FileText /><p><strong>Source-grounded by design</strong><span>Material-based questions can show the document and page they came from, so you can return to your own notes.</span></p></div>
    </section>
    <section className="tayyar-final-cta"><div><p className="tayyar-mini-label">YOUR COURSEWORK, IN ONE STUDY LOOP</p><h2>Ready to choose what you<br /><span>study next?</span></h2><p>Start with one subject and a course PDF.</p></div><Link href="/signup" className="tayyar-button-light">Get started <ArrowRight /></Link></section>
    <footer className="tayyar-footer"><div className="tayyar-footer-main"><div><Link href="/" className="tayyar-brand"><span className="tayyar-brand-glyph">T</span><span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span></Link><p>Study from your own materials.<br />Know what to practice next.</p></div><div><p className="tayyar-mini-label">PRODUCT</p><Link href="/">Home</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link></div><div><p className="tayyar-mini-label">YOUR SPACE</p><Link href="/signup">Create account</Link><Link href="/login">Sign in</Link><Link href="/dashboard">Dashboard</Link></div></div><div className="tayyar-footer-bottom"><span>© 2026 Tayyar · AI Exam Preparation</span><span>Practice readiness is an estimate, not an exam mark prediction.</span></div></footer>
  </main>
}
