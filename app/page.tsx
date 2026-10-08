import Link from "next/link"
import { ArrowDownRight, ArrowRight, BookOpen, Brain, Check, FileText, Flame, Sparkles, Target, UploadCloud } from "lucide-react"

const steps = [
  { no: "01", icon: UploadCloud, title: "Bring your course material", body: "Add the PDFs you already study from. Keep lecture notes, books, slides, and past papers with the right subject." },
  { no: "02", icon: Brain, title: "Practice with context", body: "Build questions from your sources, focus on a topic, or revisit the ideas behind previous mistakes." },
  { no: "03", icon: Target, title: "Know what comes next", body: "Use your practice history, review timing, and exam date to choose a more useful next session." },
]

const features = [
  { icon: FileText, title: "Your materials stay in the loop", body: "Material-based questions can point back to a source title and page, so you can check the course content behind an answer." },
  { icon: Target, title: "Practice follows your weak spots", body: "Topic practice and mistake review use your saved quiz history to keep revision focused." },
  { icon: Flame, title: "Progress you can understand", body: "See your recent work, practice estimates, and learning streak in one student workspace." },
]

export default function HomePage() {
  return (
    <main className="tayyar-marketing-page">
      <section className="tayyar-landing-hero">
        <div className="tayyar-hero-orbit tayyar-hero-orbit-one" />
        <div className="tayyar-hero-orbit tayyar-hero-orbit-two" />
        <div className="tayyar-hero-topline"><span className="tayyar-live-indicator" />YOUR COURSE. YOUR NEXT MOVE.<span className="tayyar-topline-year">TAYYAR · 2026</span></div>
        <h1>Study that actually<br /><span>moves you forward.</span></h1>
        <div className="tayyar-hero-bottom">
          <div className="tayyar-hero-copy">
            <p>Tayyar turns your course PDFs and quiz history into a clearer plan—so you know what you’ve practiced, what needs work, and what to study next.</p>
            <div className="tayyar-hero-buttons"><Link href="/signup" className="tayyar-button-light">Build your study space <ArrowRight /></Link><Link href="/about" className="tayyar-button-outline">See how it works</Link></div>
            <div className="tayyar-hero-trust">PDF-BASED PRACTICE <i /> TOPIC PROGRESS <i /> NO MADE-UP SCORES</div>
          </div>
          <div className="tayyar-hero-visual" aria-label="Illustration of a focused study plan">
            <svg className="tayyar-route-line" viewBox="0 0 560 310" fill="none" aria-hidden="true"><path d="M2 286C74 286 77 153 169 153c69 0 63 89 134 89 66 0 63-110 129-110 54 0 43-68 100-68" stroke="currentColor" strokeWidth="2" strokeDasharray="3 10"/><path d="m511 48 21 12-4-24" stroke="currentColor" strokeWidth="2"/></svg>
            <div className="tayyar-visual-orb"><BookOpen /></div>
            <div className="tayyar-focus-card">
              <div className="tayyar-focus-card-head"><span className="tayyar-mini-label">A MORE PERSONAL STUDY LOOP</span><Sparkles /><span className="tayyar-focus-badge">YOUR MATERIAL</span></div>
              <div className="tayyar-focus-card-title"><span>Today’s focus</span><strong>Practice with a purpose</strong></div>
              <div className="tayyar-focus-row"><span className="tayyar-focus-number">01</span><span><strong>Review a weak topic</strong><small>Build a new set from your course material</small></span><ArrowDownRight /></div>
              <div className="tayyar-focus-row"><span className="tayyar-focus-number">02</span><span><strong>Revisit a past mistake</strong><small>Test the concept with a fresh question</small></span><ArrowDownRight /></div>
              <div className="tayyar-focus-card-foot"><span className="tayyar-live-indicator" />PERSONALIZED FROM YOUR PRACTICE HISTORY</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tayyar-proof-panel" aria-label="Tayyar study tools">
        <p className="tayyar-mini-label">WHAT YOUR STUDY SPACE BRINGS TOGETHER</p>
        <div className="tayyar-proof-grid"><div><strong>PDFs</strong><span>your course material</span></div><div><strong>5 modes</strong><span>focused practice</span></div><div><strong>Page links</strong><span>source-grounded questions</span></div><div><strong>Next step</strong><span>based on your progress</span></div></div>
      </section>

      <div className="tayyar-topic-marquee" aria-hidden="true"><div>Weak topics <b>✳</b> Source-based quizzes <b>✳</b> Mistake review <b>✳</b> Daily practice <b>✳</b> Exam readiness <b>✳</b> Weak topics <b>✳</b> Source-based quizzes <b>✳</b> Mistake review <b>✳</b></div></div>

      <section id="how-it-works" className="tayyar-steps-section">
        <div className="tayyar-section-intro"><div><p className="tayyar-mini-label">A BETTER STUDY LOOP</p><h2>From course notes<br />to <span>confident revision.</span></h2></div><p>Keep practice connected to what you’re learning. Use each result to make the next study session more useful.</p></div>
        <div className="tayyar-step-cards">{steps.map(({ no, icon: Icon, title, body }, i) => <article key={no} className={`tayyar-step-card step-${i + 1}`}><div className="tayyar-step-card-top"><span className="tayyar-icon-square"><Icon /></span><strong>{no}</strong></div><h3>{title}</h3><p>{body}</p><div className="tayyar-step-card-foot"><span /><small>{i === 0 ? "YOUR PDFs" : i === 1 ? "YOUR ANSWERS" : "YOUR NEXT SESSION"}</small></div>{i < 2 && <span className="tayyar-step-connector">↘</span>}</article>)}</div>
      </section>

      <section className="tayyar-features-section"><div className="tayyar-section-intro"><div><p className="tayyar-mini-label">BUILT AROUND YOUR LEARNING</p><h2>Know what you know.<br /><span>Practice what you don’t.</span></h2></div><Link className="tayyar-text-link" href="/about">Explore the study tools <ArrowRight /></Link></div>
        <div className="tayyar-feature-grid">{features.map(({ icon: Icon, title, body }, i) => <article key={title} className="tayyar-feature-card"><div className="tayyar-feature-card-top"><span className="tayyar-icon-square"><Icon /></span><span>0{i + 1}</span></div><h3>{title}</h3><p>{body}</p><Check className="tayyar-feature-check" /></article>)}</div>
      </section>

      <section id="pricing" className="tayyar-home-pricing">
        <div className="tayyar-home-pricing-copy"><p className="tayyar-mini-label">CLEAR, HONEST ACCESS</p><h2>Everything you need<br /><span>to get started.</span></h2><p>Tayyar’s current study tools are available in one workspace. Paid plans and billing are not configured, so you won’t see placeholder prices here.</p><Link href="/pricing" className="tayyar-text-link">See what’s included <ArrowRight /></Link></div>
        <article className="tayyar-home-pricing-card"><div className="tayyar-home-pricing-card-head"><span className="tayyar-icon-square"><BookOpen /></span><span className="tayyar-current-badge"><i /> CURRENT WORKSPACE</span></div><p className="tayyar-home-pricing-label">ONE STUDY SPACE</p><h3>Built around your course.</h3><p>PDF study materials, focused quiz modes, progress history, and a personalized next step.</p><ul><li><Check /> Source-linked practice</li><li><Check /> Weak-topic and mistake review</li><li><Check /> Exam-date-aware recommendations</li></ul><Link href="/signup" className="tayyar-button-light">Create your study space <ArrowRight /></Link><small>Plan availability and billing details will be shown when configured.</small></article>
      </section>

      <section id="faq" className="tayyar-home-faq">
        <div className="tayyar-home-faq-intro"><p className="tayyar-mini-label">BEFORE YOU BEGIN</p><h2>Quick<br /><span>answers.</span></h2><p>Get the essentials about materials, practice, and your readiness estimate.</p><Link href="/faq" className="tayyar-text-link">Visit all FAQs <ArrowRight /></Link></div>
        <div className="tayyar-home-faq-list">
          <details><summary>Which study materials can I add?</summary><p>You can upload PDF lecture notes, books, slides, and past papers, then organize them by subject.</p></details>
          <details><summary>Are questions based on my own material?</summary><p>Material quizzes use relevant extracted passages. When source details are available, you can check the document and page.</p></details>
          <details><summary>What does Practice Mastery tell me?</summary><p>It is an estimate based on your saved quiz performance to help guide revision—not a precise knowledge score or exam-mark prediction.</p></details>
        </div>
      </section>

      <section className="tayyar-final-cta"><div><p className="tayyar-mini-label">START WITH ONE SUBJECT</p><h2>Make your next revision<br /><span>session count.</span></h2><p>Bring a course PDF. Tayyar will help you choose a focused next step.</p></div><Link href="/signup" className="tayyar-button-light">Get started <ArrowRight /></Link></section>

      <footer className="tayyar-footer"><div className="tayyar-footer-main"><div><Link href="/" className="tayyar-brand"><span className="tayyar-brand-glyph">T</span><span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span></Link><p>Study from your own materials.<br />Know what to practice next.</p><span className="tayyar-footer-tag"><Check /> Built around your coursework</span></div><div><p className="tayyar-mini-label">PRODUCT</p><Link href="/about">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link></div><div><p className="tayyar-mini-label">YOUR SPACE</p><Link href="/signup">Create account</Link><Link href="/login">Sign in</Link><Link href="/dashboard">Dashboard</Link></div></div><div className="tayyar-footer-bottom"><span>© 2026 Tayyar · AI Exam Preparation</span><span>Practice mastery is an estimate, not a predicted exam mark.</span></div></footer>
    </main>
  )
}
