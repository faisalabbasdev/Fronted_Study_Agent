"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, ArrowRight, BookOpen, Brain, CalendarDays, ChartNoAxesCombined, Clock3, FileText, Flame, GraduationCap, LayoutDashboard, Loader2, LogOut, Menu, Plus, Sparkles, Target, TrendingUp, UploadCloud, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient, StudentSubject } from "@/lib/api"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { StudyLoader } from "@/components/ui/study-loader"
import ThemeToggle from "@/components/theme-toggle"

type Mistake = {
  question_id: string; question: string; topic: string; subject: string; subject_id?: number
  your_answer_text?: string; correct_answer_text?: string; explanation?: string
  source?: { material_id: number; title: string; page: number }
}

const materialLabels: Record<string, string> = { lecture: "Lecture notes", book: "Book", slides: "Slides", past_paper: "Past paper" }
type MaterialType = "lecture" | "book" | "slides" | "past_paper"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [overview, setOverview] = useState<any>(null)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([])
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const [analyzing, setAnalyzing] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [materialType, setMaterialType] = useState<MaterialType>("lecture")
  const [draft, setDraft] = useState({ name: "", university: "", program: "", semester: "", exam_date: "" })

  const refresh = useCallback(async () => {
    try {
      const [nextOverview, nextMistakes, quizHistory, sessions] = await Promise.allSettled([
        apiClient.getLearningOverview(), apiClient.getMistakes(), apiClient.getQuizHistory(5), apiClient.getStudySessions({ limit: 5 }),
      ])
      if (nextOverview.status === "rejected") throw nextOverview.reason
      if (nextMistakes.status === "rejected") throw nextMistakes.reason
      setOverview(nextOverview.value)
      setMistakes(nextMistakes.value.mistakes || [])
      setRecentQuizzes(quizHistory.status === "fulfilled" ? quizHistory.value?.quizzes || [] : [])
      setRecentSessions(sessions.status === "fulfilled" && Array.isArray(sessions.value) ? sessions.value : [])
      setError("")
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load your learning data")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login")
    if (isAuthenticated) void refresh()
  }, [isAuthenticated, isLoading, refresh, router])

  useEffect(() => {
    const profile = user?.preferences?.onboarding
    if (!profile) return
    setDraft((current) => ({
      ...current,
      university: current.university || profile.university || "",
      program: current.program || profile.program || "",
      semester: current.semester || profile.semester || "",
    }))
  }, [user])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15, 0.35, 0.6] })
    const sections = ["overview", "subjects", "weak-topics", "mistakes", "progress", "activity"]
      .map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const addSubject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError("")
    try {
      await apiClient.createLearningSubject(draft)
      setDraft({ name: "", university: "", program: "", semester: "", exam_date: "" })
      setShowSubjectForm(false); await refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add this subject") }
    finally { setSaving(false) }
  }

  const upload = async (subjectId: number, file?: File) => {
    if (!file) return
    setUploading(subjectId); setError("")
    try { await apiClient.uploadStudyMaterial(subjectId, file, materialType); await refresh() }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not process this PDF") }
    finally { setUploading(null) }
  }

  const updateExamDate = async (subjectId: number, exam_date: string) => {
    try { await apiClient.updateLearningSubject(subjectId, { exam_date: exam_date || null }); await refresh() }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update the exam date") }
  }

  const practice = (subject: StudentSubject, mode: string, topic?: string, materialId?: number) => {
    const params = new URLSearchParams({ mode, subjectId: String(subject.id), topic: subject.name })
    if (topic) params.set("topics", topic)
    if (materialId) params.set("materialId", String(materialId))
    router.push(`/quiz-setup?${params.toString()}`)
  }

  const startToday = () => {
    const plan = overview?.daily_practice?.recommendation
    if (!plan) { router.push("/quiz-setup"); return }
    const params = new URLSearchParams({ mode: "daily", subjectId: String(plan.subject_id), topic: plan.subject,
      topics: plan.items.map((item: any) => item.topic).join(","),
      numQuestions: String(Math.min(20, plan.items.reduce((sum: number, item: any) => sum + item.questions, 0))) })
    router.push(`/quiz-setup?${params.toString()}`)
  }

  const practiceMistakes = () => {
    const subjectId = mistakes.find((item) => item.subject_id)?.subject_id
    const params = new URLSearchParams({ mode: "mistake" })
    if (subjectId) params.set("subjectId", String(subjectId))
    router.push(`/quiz-setup?${params.toString()}`)
  }

  if (isLoading || loading) return <main className="grid min-h-[70vh] place-items-center px-5"><StudyLoader size="xl" variant="detailed" text="Preparing your study space…" /></main>
  if (!isAuthenticated) return null

  const subjects: StudentSubject[] = overview?.subjects || []
  const plan = overview?.daily_practice?.recommendation
  const displayName = user?.full_name?.trim()?.split(" ")[0] || user?.username || "there"

  const sectionLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "subjects", label: "My subjects", icon: BookOpen },
    { id: "weak-topics", label: "Focus topics", icon: Target },
    { id: "mistakes", label: "Mistake book", icon: FileText },
    { id: "progress", label: "Progress", icon: ChartNoAxesCombined },
    { id: "activity", label: "Recent activity", icon: Activity },
  ]
  const jumpToSection = (id: string) => {
    setActiveSection(id)
    setMobileNavOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="tayyar-dashboard min-h-screen px-3 pb-12 pt-5 sm:px-5 lg:px-0 lg:pb-0 lg:pt-0">
      <div className="tayyar-dashboard-shell mx-auto grid w-full max-w-[1660px] gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-0">
      <aside className="tayyar-sidebar hidden lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col" aria-label="Dashboard sidebar">
        <Link href="/dashboard" className="tayyar-sidebar-brand">
          <span className="tayyar-brand-mark">T</span><span className="min-w-0"><strong>Tayyar</strong><small>STUDENT WORKSPACE</small></span>
        </Link>
        <div className="tayyar-sidebar-context"><span className="tayyar-context-icon"><GraduationCap className="h-4 w-4" /></span><span className="min-w-0"><strong>My learning</strong><small>{subjects.length ? `${subjects.length} active ${subjects.length === 1 ? "subject" : "subjects"}` : "Start with a subject"}</small></span></div>
        <p className="tayyar-sidebar-label">STUDY SPACE</p>
        <nav className="tayyar-sidebar-nav" aria-label="Study space">
          {sectionLinks.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-current={activeSection === id ? "page" : undefined} onClick={() => jumpToSection(id)} className={`tayyar-sidebar-link ${activeSection === id ? "is-active" : ""}`}><Icon className="h-[17px] w-[17px]" /><span>{label}</span>{activeSection === id && <span className="tayyar-sidebar-indicator" />}</button>)}
        </nav>
        <p className="tayyar-sidebar-label mt-7">PRACTICE</p>
        <nav className="tayyar-sidebar-nav" aria-label="Practice tools">
          <Link href="/quiz-setup" className="tayyar-sidebar-link"><Target className="h-[17px] w-[17px]" /><span>Build a quiz</span><ArrowRight className="ml-auto h-3.5 w-3.5 opacity-50" /></Link>
          <Link href="/study-modes" className="tayyar-sidebar-link"><Brain className="h-[17px] w-[17px]" /><span>Study modes</span><ArrowRight className="ml-auto h-3.5 w-3.5 opacity-50" /></Link>
        </nav>
        <div className="tayyar-sidebar-spacer" />
        <div className="tayyar-sidebar-tip"><span className="tayyar-tip-icon"><Sparkles className="h-4 w-4" /></span><p><strong>Make today count</strong><small>One focused session is a good start.</small></p></div>
        <div className="tayyar-sidebar-user"><span className="tayyar-user-avatar">{displayName.slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1"><strong>{user?.full_name || user?.username || "Student"}</strong><small>Student account</small></span></div>
        <button type="button" className="tayyar-logout-link" onClick={logout}><LogOut className="h-4 w-4" />Sign out of Tayyar</button>
      </aside>

      <div className="tayyar-dashboard-content min-w-0">
      <nav className="tayyar-mobile-nav lg:hidden" aria-label="Dashboard sections">
        <div className="flex items-center gap-2"><span className="tayyar-brand-mark h-9 w-9 text-sm">T</span><span className="font-semibold">Tayyar</span></div>
        <button type="button" aria-expanded={mobileNavOpen} aria-label="Toggle dashboard navigation" className="tayyar-mobile-menu-button" onClick={() => setMobileNavOpen((open) => !open)}><Menu className="h-4 w-4" />Sections</button>
        <button type="button" className="tayyar-mobile-logout" onClick={logout} aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
        {mobileNavOpen && <div className="tayyar-mobile-nav-panel">{sectionLinks.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => jumpToSection(id)} className={activeSection === id ? "is-active" : ""}><Icon className="h-4 w-4" />{label}</button>)}<Link href="/quiz-setup"><Target className="h-4 w-4" />Build a quiz</Link><Link href="/study-modes"><Brain className="h-4 w-4" />Study modes</Link></div>}
      </nav>

      <header id="overview" className="tayyar-dashboard-header scroll-mt-24 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="tayyar-eyebrow">YOUR STUDY SPACE <span className="tayyar-live-dot" /></p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Good to see you, {displayName}.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">Your study plan, progress, and next steps—all in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" className="tayyar-outline-button" onClick={() => setShowSubjectForm((open) => !open)}><Plus className="mr-2 h-4 w-4" />Add subject</Button>
        </div>
      </header>

      {error && <div role="alert" className="mt-5 flex items-center justify-between rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError("")}><X className="h-4 w-4" /></button></div>}

      {showSubjectForm && <section className="tayyar-panel mt-7 p-5 sm:p-6"><div className="mb-4 flex items-start justify-between"><div><p className="text-sm font-semibold">Set up a subject</p><p className="mt-1 text-sm text-muted-foreground">Use the academic details that fit your university or program.</p></div><button aria-label="Close form" onClick={() => setShowSubjectForm(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button></div>
        <form onSubmit={addSubject} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input required aria-label="Subject name" placeholder="Subject name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input aria-label="University" placeholder="University (optional)" value={draft.university} onChange={(e) => setDraft({ ...draft, university: e.target.value })} />
          <Input aria-label="Program" placeholder="Program (optional)" value={draft.program} onChange={(e) => setDraft({ ...draft, program: e.target.value })} />
          <Input aria-label="Semester" placeholder="Semester (optional)" value={draft.semester} onChange={(e) => setDraft({ ...draft, semester: e.target.value })} />
          <div className="flex gap-2"><Input aria-label="Exam date" type="date" value={draft.exam_date} onChange={(e) => setDraft({ ...draft, exam_date: e.target.value })} /><Button type="submit" disabled={saving} className="shrink-0">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button></div>
        </form>
      </section>}

      <section className="tayyar-hero mt-8 overflow-hidden rounded-[28px] p-6 sm:p-9 lg:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85"><Sparkles className="h-3.5 w-3.5 text-lime-300" /> PERSONALIZED FOR YOUR PROGRESS</div>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">Make your next study session count.</h2>
            {plan ? <><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">A focused plan for <strong className="font-medium text-white">{plan.subject}</strong>, chosen from your practice history, review timing, and exam date.</p>
              <div className="mt-5 flex flex-wrap gap-2">{plan.items.map((item: any) => <span key={item.topic} className="rounded-full border border-white/15 bg-white/[.07] px-3 py-1.5 text-sm text-white/90">{item.questions} × {item.topic}</span>)}</div>
              <ul className="mt-4 space-y-1.5 text-xs leading-5 text-white/60">{plan.items.map((item: any) => <li key={item.topic} className="flex gap-2"><span className="text-lime-300">↗</span>{item.reason}</li>)}</ul>
            </> : <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">Add a subject and upload your course material. Your daily practice will be built from your topics and quiz history.</p>}
            <Button onClick={startToday} className="mt-6 bg-lime-300 text-slate-950 hover:bg-lime-200">Start today&apos;s practice <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Practice mastery" value={`${overview?.practice_mastery ?? 0}%`} detail="Readiness estimate" icon={<Brain />} />
            <Metric label="Questions tried" value={overview?.total_questions ?? 0} detail={`${overview?.total_quizzes ?? 0} completed quizzes`} icon={<Target />} />
            <Metric label="Average score" value={`${overview?.average_score ?? 0}%`} detail="Across completed quizzes" icon={<TrendingUp />} />
            <Metric label="Learning streak" value={`${overview?.current_streak ?? 0}`} detail="Consecutive active days" icon={<Flame />} />
          </div>
        </div>
      </section>

      <section id="subjects" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="tayyar-eyebrow">YOUR COURSEWORK</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Subjects</h2></div><span className="text-sm text-muted-foreground">{subjects.length} {subjects.length === 1 ? "subject" : "subjects"}</span></div>
        {subjects.length ? <div className="grid gap-4 xl:grid-cols-2">{subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} materialType={materialType} setMaterialType={setMaterialType} uploading={uploading === subject.id} analyzingMaterialId={analyzing}
          onUpload={(file) => void upload(subject.id, file)} onExamDate={(value) => void updateExamDate(subject.id, value)}
          onAnalyze={async (id) => { setAnalyzing(id); try { await apiClient.analyzePastPaper(id); await refresh() } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not analyze the past paper") } finally { setAnalyzing(null) }} }
          onOpen={async (id, page) => { try { await apiClient.openMaterialSource(id, page) } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not open the PDF") } }}
          onPractice={(mode, topic, materialId) => practice(subject, mode, topic, materialId)} />)}</div>
          : <div className="tayyar-panel grid gap-5 p-7 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-base font-semibold">Your courses start here</p><p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">Add a subject, then attach lecture notes, slides, books, or past papers as PDFs to create source-grounded practice.</p></div><Button onClick={() => setShowSubjectForm(true)}><Plus className="mr-2 h-4 w-4" />Add your first subject</Button></div>}
      </section>

      <section id="weak-topics" className="mt-10 scroll-mt-24 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="tayyar-panel p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="tayyar-eyebrow">FOCUS NEXT</p><h2 className="mt-1 text-lg font-semibold">Topics to strengthen</h2></div><div className="tayyar-icon-tile"><Target className="h-5 w-5" /></div></div>
          {(overview?.weak_topics || []).length ? <div className="mt-5 space-y-4">{overview.weak_topics.slice(0, 5).map((topic: any) => { const subject = subjects.find((item) => item.topic_performance.some((entry) => entry.topic === topic.topic)); return <div key={`${subject?.id}-${topic.topic}`}><div className="mb-1.5 flex items-center justify-between gap-3"><div><span className="text-sm font-medium">{topic.topic}</span><span className="ml-2 text-xs text-muted-foreground">{subject?.name}</span></div><span className="text-sm font-semibold tabular-nums">{topic.mastery}%</span></div><Progress value={topic.mastery} className="h-2" /><div className="mt-2 flex justify-end"><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => subject && practice(subject, "topic", topic.topic)}>Practice topic <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Button></div></div>})}</div>
            : <div className="mt-5 rounded-xl bg-muted/40 px-4 py-5"><p className="text-sm font-medium">No weak topics identified yet</p><p className="mt-1 text-sm text-muted-foreground">Complete a few quizzes to see which concepts deserve more attention.</p></div>}
        </div>
        <div id="mistakes" className="tayyar-panel scroll-mt-24 p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="tayyar-eyebrow">REVIEW WHAT YOU MISSED</p><h2 className="mt-1 text-lg font-semibold">Mistake book <span className="text-muted-foreground">({mistakes.length})</span></h2></div><div className="tayyar-icon-tile"><BookOpen className="h-5 w-5" /></div></div>
          {mistakes.length ? <><div className="mt-5 space-y-3">{mistakes.slice(0, 2).map((item, index) => <div key={`${item.question_id}-${index}`} className="rounded-xl border border-border/70 p-3.5"><div className="mb-2 flex items-center justify-between gap-2"><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">{item.topic}</span><span className="text-xs text-muted-foreground">{item.subject}</span></div><p className="line-clamp-2 text-sm font-medium leading-5">{item.question}</p><p className="mt-2 text-xs text-muted-foreground">Your answer: <span className="text-rose-600 dark:text-rose-400">{item.your_answer_text || "Not answered"}</span></p>{item.explanation && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.explanation}</p>}</div>)}</div><Button variant="outline" className="mt-4 w-full" onClick={practiceMistakes}>Practice concepts from my mistakes <ArrowRight className="ml-2 h-4 w-4" /></Button></>
            : <div className="mt-5 rounded-xl bg-muted/40 px-4 py-5"><p className="text-sm font-medium">Your review list is clear</p><p className="mt-1 text-sm text-muted-foreground">Questions you miss will appear here with their correct answer and explanation.</p></div>}
        </div>
      </section>

      <section id="progress" className="mt-10 scroll-mt-24"><div className="mb-4"><p className="tayyar-eyebrow">YOUR PRACTICE READINESS</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Progress by subject</h2><p className="mt-1 text-sm text-muted-foreground">Practice estimates based on your quiz history.</p></div>
        {subjects.length ? <div className="grid gap-3 md:grid-cols-2">{subjects.map((subject) => { const topics = subject.topic_performance || []; const strong = topics.filter((topic) => topic.mastery >= 75).length; const improving = topics.filter((topic) => topic.mastery >= 50 && topic.mastery < 75).length; const weak = topics.filter((topic) => topic.mastery < 50).length; return <article key={subject.id} className="tayyar-panel p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{subject.name}</h3><p className="mt-1 text-xs text-muted-foreground">{subject.questions_attempted} questions practiced</p></div><span className="tayyar-readiness-value">{subject.practice_mastery}%</span></div><Progress value={subject.practice_mastery} className="mt-4 h-2" /><div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="tayyar-topic-pill">{strong} strong</span><span className="tayyar-topic-pill">{improving} improving</span><span className="tayyar-topic-pill is-weak">{weak} to strengthen</span></div></article> })}</div> : <div className="tayyar-panel p-5 text-sm text-muted-foreground">Your subject readiness estimates will appear after you add a subject and practice.</div>}
        {(overview?.improved_topics || []).length > 0 && <div className="tayyar-panel mt-4 p-5"><div className="mb-4 flex items-center gap-3"><div className="tayyar-icon-tile"><TrendingUp className="h-4 w-4" /></div><div><h3 className="text-sm font-semibold">Topics moving forward</h3><p className="text-xs text-muted-foreground">Compared with your earlier practice</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{overview.improved_topics.slice(0, 6).map((topic: any) => <div key={topic.topic} className="tayyar-improved-topic"><span className="truncate text-sm font-medium">{topic.topic}</span><span className="shrink-0 text-xs font-semibold text-emerald-400">+{topic.improvement} pts</span></div>)}</div></div>}
      </section>

      <section id="activity" className="mt-10 scroll-mt-24"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="tayyar-eyebrow">KEEP YOUR MOMENTUM</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Recent activity</h2></div><Link href="/quiz-setup" className="text-sm font-medium text-primary hover:underline">Start a quiz <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link></div>
        {recentQuizzes.length || recentSessions.length ? <div className="tayyar-panel divide-y divide-border/70">{[...recentQuizzes.map((item) => ({ ...item, activityType: "quiz" })), ...recentSessions.map((item: any) => ({ ...item, activityType: "session" }))].sort((a, b) => new Date(b.created_at || b.completed_at || 0).getTime() - new Date(a.created_at || a.completed_at || 0).getTime()).slice(0, 6).map((activity: any, index) => <div key={`${activity.activityType}-${activity.id}-${index}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5"><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/5 text-primary">{activity.activityType === "quiz" ? <Target className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{activity.topic || activity.subject || "Study session"}</p><p className="text-xs capitalize text-muted-foreground">{activity.activityType === "quiz" ? `${activity.correct_answers ?? 0}/${activity.total_questions ?? 0} correct · ${activity.difficulty || "practice"}` : `${activity.mode || "Study"} · ${activity.duration_minutes || 0} min`}</p></div></div><div className="flex items-center gap-3">{activity.activityType === "quiz" && <><div className="text-right"><p className="text-sm font-semibold tabular-nums">{Math.round(activity.score || 0)}%</p><p className="text-[11px] text-muted-foreground">{activity.created_at ? new Date(activity.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</p></div><Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelectedQuiz(activity)}>Review</Button></>}{activity.activityType === "session" && <p className="text-[11px] text-muted-foreground">{(activity.created_at || activity.completed_at) ? new Date(activity.created_at || activity.completed_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</p>}</div></div>)}</div>
          : <div className="tayyar-panel flex flex-wrap items-center justify-between gap-4 p-5"><p className="text-sm text-muted-foreground">Your completed quizzes and learning sessions will show up here.</p><Button asChild size="sm" variant="outline"><Link href="/study-modes">Explore study modes</Link></Button></div>}
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">Practice mastery and readiness are estimates based on your quiz history, not predicted exam marks.</p>

      {selectedQuiz && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedQuiz(null) }}><section role="dialog" aria-modal="true" aria-label="Quiz answer review" className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-background shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-background/95 px-5 py-4 backdrop-blur"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">QUIZ REVIEW</p><h2 className="mt-1 text-lg font-semibold">{selectedQuiz.topic || "Practice quiz"} · {Math.round(selectedQuiz.score || 0)}%</h2><p className="mt-1 text-xs text-muted-foreground">{selectedQuiz.correct_answers || 0} of {selectedQuiz.total_questions || 0} correct</p></div><button aria-label="Close review" onClick={() => setSelectedQuiz(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button></div><div className="space-y-3 p-4 sm:p-5">{Object.entries(selectedQuiz.questions_data || {}).filter(([key]) => key !== "__meta__").map(([id, question]: [string, any], index: number) => <article key={id} className="rounded-xl border p-4"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">Question {index + 1}{question.topic ? ` · ${question.topic}` : ""}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${question.is_correct ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>{question.is_correct ? "Correct" : "Review this"}</span></div><p className="text-sm font-medium leading-6">{question.question}</p>{!question.is_correct && <p className="mt-3 text-xs leading-5 text-muted-foreground">Your answer: <span className="text-rose-600 dark:text-rose-400">{question.user_answer ? `${question.user_answer}. ${question.options?.[question.user_answer.charCodeAt(0) - 65] || ""}` : "Not answered"}</span><br />Correct answer: <span className="text-emerald-700 dark:text-emerald-300">{question.correct_answer}. {question.options?.[question.correct_answer?.charCodeAt(0) - 65] || ""}</span></p>}{question.explanation && <p className="mt-2 text-xs leading-5 text-muted-foreground">{question.explanation}</p>}{question.source && <p className="mt-2 text-[11px] text-muted-foreground">Source: {question.source.title}, page {question.source.page}</p>}</article>)}</div></section></div>}
      </div>
      </div>
    </main>
  )
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: ReactNode }) {
  return <div className="tayyar-metric rounded-2xl border border-white/10 bg-white/[.07] p-4 text-white backdrop-blur-sm"><div className="flex items-center justify-between gap-2"><span className="text-xs text-white/60">{label}</span><span className="text-lime-300 [&>svg]:h-4 [&>svg]:w-4">{icon}</span></div><p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-[11px] text-white/50">{detail}</p></div>
}

function SubjectCard({ subject, materialType, setMaterialType, uploading, analyzingMaterialId, onUpload, onExamDate, onAnalyze, onOpen, onPractice }: {
  subject: StudentSubject; materialType: MaterialType; setMaterialType: (value: MaterialType) => void; uploading: boolean; analyzingMaterialId: number | null
  onUpload: (file?: File) => void; onExamDate: (value: string) => void; onAnalyze: (id: number) => void | Promise<void>; onOpen: (id: number, page?: number) => void | Promise<void>
  onPractice: (mode: string, topic?: string, materialId?: number) => void
}) {
  const materials = subject.materials || []
  return <article className="tayyar-panel overflow-hidden">
    <div className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h3 className="truncate text-lg font-semibold tracking-tight">{subject.name}</h3><p className="mt-1 text-sm text-muted-foreground">{[subject.university, subject.program, subject.semester].filter(Boolean).join(" · ") || "Add university or program details anytime"}</p></div><div className="rounded-xl bg-primary/5 p-2.5 text-primary"><BookOpen className="h-5 w-5" /></div></div>
      <div className="mt-5 grid grid-cols-3 gap-2"><SubjectStat value={`${subject.practice_mastery ?? 0}%`} label="Practice mastery" /><SubjectStat value={`${subject.average_score ?? 0}%`} label="Average score" /><SubjectStat value={subject.questions_attempted ?? 0} label="Questions" /></div>
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted/40 p-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background text-muted-foreground"><CalendarDays className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium">Exam date</p><p className="text-xs text-muted-foreground">{subject.days_until_exam == null ? "Not set" : subject.days_until_exam < 0 ? "Date has passed" : subject.days_until_exam === 0 ? "Today" : `${subject.days_until_exam} days away`}</p></div><Input aria-label={`Exam date for ${subject.name}`} type="date" value={subject.exam_date || ""} onChange={(event) => onExamDate(event.target.value)} className="h-9 max-w-[155px] bg-background text-xs" /></div>
      {subject.topic_performance?.length > 0 && <div className="mt-5"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic progress</p><span className="text-[11px] text-muted-foreground">{subject.weak_topics?.length || 0} to strengthen</span></div><div className="space-y-3">{subject.topic_performance.slice(0, 3).map((topic) => <div key={topic.topic}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium">{topic.topic}</span><span className="tabular-nums text-muted-foreground">{topic.mastery}%</span></div><Progress value={topic.mastery} className="h-1.5" /></div>)}</div></div>}
      <div className="mt-5 flex flex-wrap gap-2"><Button size="sm" onClick={() => onPractice("material")} disabled={!materials.length}><BookOpen className="mr-2 h-3.5 w-3.5" />Study material</Button><Button size="sm" variant="outline" onClick={() => onPractice("exam")} disabled={!materials.length}><Clock3 className="mr-2 h-3.5 w-3.5" />Exam practice</Button>{subject.weak_topics?.[0] && <Button size="sm" variant="ghost" onClick={() => onPractice("topic", subject.weak_topics[0].topic)}>Weak topic <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>}</div>
    </div>
    <div className="border-t border-border/70 bg-muted/15 px-5 py-4 sm:px-6"><div className="mb-3 flex items-center justify-between gap-2"><p className="text-xs font-semibold">Study materials <span className="font-normal text-muted-foreground">{materials.length}</span></p><select aria-label={`Material type for ${subject.name}`} className="h-8 rounded-lg border bg-background px-2 text-xs" value={materialType} onChange={(e) => setMaterialType(e.target.value as MaterialType)}><option value="lecture">Lecture notes</option><option value="book">Book</option><option value="slides">Slides</option><option value="past_paper">Past paper</option></select></div>
      {materials.length ? <div className="mb-3 space-y-2">{materials.slice(0, 3).map((material: any) => { const isAnalyzing = analyzingMaterialId === material.id; return <div key={material.id} className="rounded-lg border border-border/70 bg-background px-3 py-2.5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex min-w-0 items-center gap-2.5"><FileText className="h-4 w-4 shrink-0 text-primary" /><div className="min-w-0"><p className="truncate text-xs font-medium">{material.title}</p><p className="text-[10px] text-muted-foreground">{materialLabels[material.material_type] || material.material_type} · {material.page_count} pages</p></div></div><div className="flex items-center gap-1"><button className="rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/5" onClick={() => void onOpen(material.id)}>View PDF</button>{material.material_type === "past_paper" && <button disabled={isAnalyzing} className="rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/5 disabled:opacity-50" onClick={() => void onAnalyze(material.id)}>{isAnalyzing ? "Analyzing…" : material.analysis?.length ? "Re-analyze" : "Analyze topics"}</button>}</div></div>{material.material_type === "past_paper" && <div className="mt-2 flex flex-wrap items-center gap-2">{material.analysis?.length ? <span className="mr-auto text-[10px] text-muted-foreground">{material.analysis.slice(0, 3).map((item: any) => `Q${item.question_number} · ${item.topic} · p.${item.page}`).join("  /  ")}</span> : <span className="mr-auto text-[10px] text-muted-foreground">Analyze to identify topics from this paper.</span>}<button className="rounded-md px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/5" onClick={() => onPractice("exam", undefined, material.id)}>Practice this paper</button>{material.topics?.length > 0 && <button className="rounded-md px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/5" onClick={() => onPractice("topic", material.topics.join(","), material.id)}>Practice paper topics</button>}</div>}</div>})}</div> : <p className="mb-3 text-xs text-muted-foreground">Add a PDF to generate quizzes grounded in your course content.</p>}
      {materials.flatMap((material: any) => material.material_type === "past_paper" ? (material.analysis || []).map((item: any, index: number) => ({ ...item, materialId: material.id, key: `${material.id}-${item.question_number}-${index}` })) : []).length > 0 && <div className="mb-3 space-y-2">
        {materials.flatMap((material: any) => material.material_type === "past_paper" ? (material.analysis || []).map((item: any, index: number) => ({ ...item, materialId: material.id, key: `${material.id}-${item.question_number}-${index}` })) : []).map((item: any) => <div key={item.key} className="rounded-lg border border-border/70 bg-background px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold">Past paper Q{item.question_number} · {item.topic} · page {item.page}</p><Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onPractice("topic", item.topic, item.study_source?.material_id)}>Practice this topic</Button></div>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">Past-paper evidence: “{item.evidence}”</p>
          {item.study_source ? <div className="mt-2 rounded-md bg-primary/[.04] p-2"><p className="text-[11px] font-medium">Related course passage · {item.study_source.title} · page {item.study_source.page}</p><p className="mt-1 text-[11px] leading-5 text-muted-foreground">“{item.study_source.evidence}”</p><button className="mt-1 text-[11px] font-medium text-primary hover:underline" onClick={() => void onOpen(item.study_source.material_id, item.study_source.page)}>View lecture page</button></div>
            : <p className="mt-2 text-[11px] text-muted-foreground">No related lecture passage could be verified from your uploaded materials.</p>}
        </div>)}
      </div>}
      <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-3 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-primary/[.03] ${uploading ? "pointer-events-none opacity-60" : ""}`}><input type="file" accept="application/pdf,.pdf" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; onUpload(file); event.target.value = "" }} />{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}{uploading ? "Extracting PDF text…" : "Upload a PDF"}</label>
    </div>
  </article>
}

function SubjectStat({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-xl bg-muted/40 px-3 py-2.5"><p className="text-base font-semibold tabular-nums">{value}</p><p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{label}</p></div>
}
