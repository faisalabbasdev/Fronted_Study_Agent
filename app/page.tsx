import Link from "next/link"
import { ArrowRight, BookOpen, Brain, CheckCircle2, FileText, GraduationCap, Layers3, Lightbulb, ListChecks, Target, TrendingUp, Upload } from "lucide-react"
import BrandLogo from "@/components/brand-logo"

const steps = [
  { icon: Layers3, number: "01", title: "Choose a subject", body: "Create a space for a class you are taking and add an exam date if you have one." },
  { icon: Upload, number: "02", title: "Add your course material", body: "Upload lecture notes, slides, books, or past papers as PDFs." },
  { icon: Brain, number: "03", title: "Practice what you are learning", body: "Build quizzes from your material, focus on a topic, or revisit a question you missed." },
  { icon: TrendingUp, number: "04", title: "Review your progress", body: "Use your quiz history and topic estimates to decide what to study next." },
]

const studyTools = [
  { icon: FileText, title: "Your course materials", body: "Keep notes, slides, books, and past papers organized with each subject." },
  { icon: ListChecks, title: "Quizzes from your PDFs", body: "Practice with questions grounded in the materials you add. Check a source page when details are available." },
  { icon: Target, title: "Focused topic practice", body: "Choose a topic, review weak areas, and revisit concepts behind missed answers." },
  { icon: TrendingUp, title: "Progress you can follow", body: "See completed quizzes, recent study sessions, and practice estimates in one place." },
]

const faqs = [
  ["What is Tayyar?", "Tayyar is a study workspace for university students. Add your own course materials, practice with quizzes, review mistakes, and use your activity to plan what to study next."],
  ["How do I get started?", "Create an account, add a subject, upload a course PDF, then choose a quiz or topic practice from your student dashboard."],
  ["What can I upload?", "You can add PDF lecture notes, books, slides, and past papers to a subject."],
  ["Do progress estimates predict my exam result?", "No. Practice mastery and readiness are estimates based on saved quiz activity. They are for guiding revision, not predicting exam marks."],
]

export default function HomePage() {
  return (
    <main className="tayyar-marketing-page tayyar-learning-home">
      <section className="tayyar-landing-hero" aria-labelledby="home-title">
        <div className="tayyar-learning-hero-copy">
          <p className="tayyar-learning-kicker"><GraduationCap aria-hidden="true" /> A STUDY SPACE BUILT AROUND YOUR COURSEWORK</p>
          <h1 id="home-title">Learn with your<br /><span>course material.</span></h1>
          <p className="tayyar-learning-lede">Organize your subjects, turn your PDFs into practice, and see what to review next. Tayyar helps you study with the material you already use in class.</p>
          <div className="tayyar-hero-buttons">
            <Link href="/signup" className="tayyar-button-light">Start learning <ArrowRight aria-hidden="true" /></Link>
            <Link href="#how-it-works" className="tayyar-button-outline">See how it works</Link>
          </div>
          <div className="tayyar-learning-trust"><span><CheckCircle2 /> Your own course materials</span><span><CheckCircle2 /> Practice at your pace</span><span><CheckCircle2 /> Progress in one place</span></div>
        </div>
        <div className="tayyar-learning-preview" aria-label="Example student study workspace">
          <div className="tayyar-preview-heading">
            <div className="tayyar-preview-top"><span className="tayyar-preview-mark"><BookOpen /></span><span><strong>How studying works</strong><small>From your class to confident practice</small></span></div>
            <span className="tayyar-preview-pill">4 SIMPLE STEPS</span>
          </div>
          <div className="tayyar-preview-path">
            {[
              { icon: Lightbulb, title: "Choose a subject", body: "Create a space for one of your classes." },
              { icon: FileText, title: "Add class materials", body: "Upload your notes, slides, or past papers." },
              { icon: ListChecks, title: "Practice what you learned", body: "Make a quiz from your own materials." },
              { icon: TrendingUp, title: "Review your progress", body: "See answers and what to study next." },
            ].map(({ icon: Icon, title, body }, index) => <article className={`tayyar-path-step tone-${index + 1} ${index === 0 ? "is-current" : ""}`} key={title}>
              <div className="tayyar-path-step-top"><span className="tayyar-path-step-tag">STEP {String(index + 1).padStart(2, "0")}</span><span className="tayyar-path-track" aria-hidden="true"><i style={{ width: `${(index + 1) * 25}%` }} /></span><span className="tayyar-path-arrow"><ArrowRight aria-hidden="true" /></span></div>
              <span className="tayyar-path-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3><p>{body}</p>
            </article>)}
          </div>
          <div className="tayyar-preview-action"><Link href="/dashboard" className="tayyar-preview-link">Open My Learning <ArrowRight /></Link></div>
        </div>
      </section>

      <section className="tayyar-learning-intro" aria-label="What Tayyar offers">
        <div><BookOpen /><strong>Organize</strong><span>Subjects and course PDFs</span><ArrowRight aria-hidden="true" /></div><div><Brain /><strong>Practice</strong><span>Quizzes and focused topics</span><ArrowRight aria-hidden="true" /></div><div><TrendingUp /><strong>Improve</strong><span>Review mistakes and progress</span></div>
      </section>

      <section id="how-it-works" className="tayyar-steps-section tayyar-learning-section">
        <div className="tayyar-learning-section-heading"><p className="tayyar-learning-eyebrow">YOUR FIRST STUDY SESSION</p><h2>Four clear steps<br /><span>from class to practice.</span></h2><p>You bring the subject and study materials. Tayyar helps you turn them into a focused learning routine.</p></div>
        <div className="tayyar-learning-steps">{steps.map(({ icon: Icon, number, title, body }) => <article className="tayyar-learning-step" key={number}><div className="tayyar-learning-step-top"><span><Icon /></span><small>STEP {number}</small></div><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section id="study-tools" className="tayyar-learning-tools">
        <div className="tayyar-learning-section-heading"><p className="tayyar-learning-eyebrow">MADE FOR THE WAY STUDENTS STUDY</p><h2>Everything starts<br /><span>with your coursework.</span></h2><p>No sample catalog to figure out. Start with your own subjects and the materials you use for class.</p></div>
        <div className="tayyar-learning-tool-grid">{studyTools.map(({ icon: Icon, title, body }, index) => <article className="tayyar-learning-tool" key={title}><span className={`tayyar-learning-tool-icon tone-${index + 1}`}><Icon /></span><h3>{title}</h3><p>{body}</p></article>)}</div>
        <Link href="/study-modes" className="tayyar-text-link">Explore study tools <ArrowRight /></Link>
      </section>

      <section className="tayyar-learning-benefits">
        <div className="tayyar-learning-benefits-copy"><p className="tayyar-learning-eyebrow">A STUDY ROUTINE THAT MAKES SENSE</p><h2>Know what you studied.<br /><span>Choose what comes next.</span></h2><p>Add a class, keep its materials together, then practice and review at a time that works for you. Your dashboard makes your next step easy to find.</p><Link href="/dashboard" className="tayyar-button-light">Go to My Learning <ArrowRight /></Link></div>
        <div className="tayyar-learning-benefit-list"><div><span><CheckCircle2 /></span><p><strong>Learn on your schedule</strong><small>Study with your own materials whenever you are ready.</small></p></div><div><span><CheckCircle2 /></span><p><strong>Keep each subject organized</strong><small>Bring notes, slides, and past papers into one study space.</small></p></div><div><span><CheckCircle2 /></span><p><strong>Learn from your answers</strong><small>Review explanations and revisit the topics you missed.</small></p></div><div><span><CheckCircle2 /></span><p><strong>Follow your practice</strong><small>See your quiz history and estimates as you keep learning.</small></p></div></div>
      </section>

      <section id="faq" className="tayyar-home-faq tayyar-learning-faq">
        <div className="tayyar-home-faq-intro"><p className="tayyar-learning-eyebrow">GOOD TO KNOW</p><h2>New here?<br /><span>Start with the basics.</span></h2><p>Understand how Tayyar fits into the way you already study.</p><Link href="/faq" className="tayyar-text-link">Read all FAQs <ArrowRight /></Link></div>
        <div className="tayyar-home-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="tayyar-final-cta tayyar-learning-final"><div><p className="tayyar-learning-eyebrow">YOUR NEXT STEP STARTS HERE</p><h2>Pick a subject.<br /><span>Start learning.</span></h2><p>Create your student space and begin with a course you are already taking.</p></div><Link href="/signup" className="tayyar-button-light">Create your account <ArrowRight /></Link></section>

      <footer className="tayyar-footer tayyar-learning-footer"><div className="tayyar-footer-main"><div><Link href="/" className="tayyar-brand" aria-label="Tayyar home"><BrandLogo className="h-16 w-48 object-contain" /></Link><p>Your subjects, materials, and practice<br />together in one student learning space.</p><span className="tayyar-footer-tag"><GraduationCap /> Built around your coursework</span></div><div><p className="tayyar-learning-eyebrow">LEARN</p><Link href="/dashboard/subjects">My subjects</Link><Link href="/study-modes">Study tools</Link><Link href="/quiz-setup">Quizzes</Link><Link href="/universities">Universities</Link></div><div><p className="tayyar-learning-eyebrow">TAYYAR</p><Link href="/about">About</Link><Link href="/faq">FAQ &amp; support</Link><Link href="/pricing">Pricing</Link><Link href="/login">Log in</Link><Link href="/signup">Sign up</Link></div></div><div className="tayyar-footer-bottom"><span>© 2026 Tayyar · A study space for university students</span><span>Practice readiness is an estimate, not an exam mark prediction.</span></div></footer>
    </main>
  )
}
