"use client"

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUp, BookOpen, Brain, GraduationCap, LayoutDashboard, Loader2, LogOut, MessageCircle, Plus, Search, Sparkles, Target } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { StudyLoader } from "@/components/ui/study-loader"
import BrandLogo from "@/components/brand-logo"

type ChatMessage = { id: string; role: "user" | "assistant"; text: string }
type ChatSession = { session_id: string; title?: string | null; last_activity?: string | null; message_count?: number }
type LearningSnapshot = { subjects?: any[]; weak_topics?: any[]; daily_practice?: any; [key: string]: any }

export default function ChatPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [overview, setOverview] = useState<LearningSnapshot | null>(null)
  const [mistakes, setMistakes] = useState<any[]>([])
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([])
  const [loadingContext, setLoadingContext] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [error, setError] = useState("")
  const [mobileMenu, setMobileMenu] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!isLoading && !isAuthenticated) router.replace("/login") }, [isAuthenticated, isLoading, router])
  useEffect(() => {
    if (!isAuthenticated) return
    Promise.allSettled([apiClient.getLearningOverview(), apiClient.getQuizHistory(5), apiClient.getChatSessions()])
      .then(([learning, history, sessions]) => {
        if (learning.status === "fulfilled") {
          setOverview(learning.value)
          setMistakes(learning.value?.mistakes || [])
        }
        if (history.status === "fulfilled") setRecentQuizzes(history.value?.quizzes || [])
        if (sessions.status === "fulfilled") setChatSessions(sessions.value?.sessions || [])
      })
      .finally(() => setLoadingContext(false))
  }, [isAuthenticated])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }) }, [messages, sending])

  const subjects = useMemo(() => overview?.subjects || [], [overview?.subjects])
  const weakTopics = useMemo(() => overview?.weak_topics || [], [overview?.weak_topics])
  const studyContext = useMemo(() => ({
    student_name: user?.full_name || user?.username,
    university: user?.preferences?.onboarding?.university || subjects.find((subject) => subject.university)?.university || null,
    program: user?.preferences?.onboarding?.program || subjects.find((subject) => subject.program)?.program || null,
    semester: user?.preferences?.onboarding?.semester || subjects.find((subject) => subject.semester)?.semester || null,
    subjects: subjects.map((subject) => ({ name: subject.name, exam_date: subject.exam_date, practice_mastery: subject.practice_mastery, weak_topics: subject.weak_topics?.map((topic: any) => topic.topic) || [] })),
    weak_topics: weakTopics.map((topic: any) => ({ topic: topic.topic, subject: topic.subject, mastery: topic.mastery })),
    daily_recommendation: overview?.daily_practice?.recommendation || null,
    recent_quiz_results: recentQuizzes.slice(0, 5).map((quiz: any) => ({
      subject: quiz.topic,
      score_percent: Math.round(quiz.score || 0),
      correct_answers: quiz.correct_answers,
      total_questions: quiz.total_questions,
      completed_at: quiz.created_at,
    })),
    recent_mistakes: mistakes.slice(0, 5).map((mistake: any) => ({
      subject: mistake.subject,
      topic: mistake.topic,
      question: mistake.question,
      student_answer: mistake.your_answer_text,
      correct_answer: mistake.correct_answer_text,
      explanation: mistake.explanation,
    })),
    instruction: "Use this saved Tayyar study context to give specific, supportive academic guidance. Do not invent university admissions deadlines, eligibility rules, course lists, or student scores. For current university information, direct the student to the official university links in Tayyar's university directory.",
  }), [overview, subjects, user, weakTopics, recentQuizzes, mistakes])

  const sendMessage = async (text = draft) => {
    const message = text.trim()
    if (!message || sending) return
    setDraft(""); setError("")
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: message }])
    setSending(true)
    try {
      const response = await apiClient.chatWithAgent({ message, session_id: sessionId, mode: "assistant", context: studyContext })
      if (!response?.response) throw new Error("The study assistant returned an empty response. Please try again.")
      if (response.session_id) setSessionId(response.session_id)
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: response.response }])
    } catch (reason) {
      const messageText = reason instanceof Error ? reason.message : "Could not reach the study assistant. Please try again."
      setError(messageText)
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", text: "I couldn’t connect just now. Your study context is still here—try sending your question again in a moment." }])
    } finally { setSending(false) }
  }

  const openChatSession = async (chatSession: ChatSession) => {
    setError("")
    setSessionId(chatSession.session_id)
    setMobileMenu(false)
    try {
      const result = await apiClient.getChatHistory(200)
      const rows = (result?.messages || []).filter((row: any) => row.session_id === chatSession.session_id)
      setMessages(rows.flatMap((row: any) => [
        ...(row.user_message ? [{ id: `${row.id}-user`, role: "user" as const, text: row.user_message }] : []),
        ...(row.ai_response ? [{ id: `${row.id}-assistant`, role: "assistant" as const, text: row.ai_response }] : []),
      ]))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load this conversation.")
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void sendMessage() }
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage() } }
  const suggestions = [
    { icon: Target, title: "Help me with my weak topics", prompt: "Look at my weak topics and recommend what to practice first, with a short reason." },
    { icon: BookOpen, title: "Plan today's study", prompt: "Create a focused study plan for today using my subjects, exam dates, and practice history." },
    { icon: GraduationCap, title: "Explore my university", prompt: "Help me explore my university and course path. Tell me what details I should verify on the official university website." },
  ]

  if (isLoading || !isAuthenticated) return <div className="grid min-h-[80vh] place-items-center"><StudyLoader size="xl" variant="detailed" text="Opening your study chat…" /></div>

  return <main className="tayyar-chat-workspace -mt-16 flex min-h-screen">
    <aside className={`tayyar-chat-sidebar ${mobileMenu ? "is-open" : ""}`}>
      <Link href="/dashboard" className="tayyar-chat-brand" aria-label="Tayyar dashboard"><BrandLogo className="h-16 w-48 object-contain" priority /></Link>
      <div className="tayyar-platform-switch"><Link href="/dashboard"><LayoutDashboard />Platform</Link><Link href="/chat" className="is-active"><MessageCircle />Chat</Link></div>
      <button type="button" className="tayyar-chat-new" onClick={() => { setMessages([]); setSessionId(undefined); setError(""); setMobileMenu(false) }}><Plus />New study chat</button>
      <div className="px-4 pt-5">
        <p className="tayyar-chat-sidebar-label">RECENT CHATS</p>
        {chatSessions.length ? <div className="mt-2 grid gap-1">{chatSessions.map((item) => <button key={item.session_id} type="button" onClick={() => void openChatSession(item)} className={`truncate rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/[0.06] ${sessionId === item.session_id ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"}`}>{item.title || "Study conversation"}</button>)}</div> : <p className="tayyar-chat-sidebar-empty mt-2">Your saved chats will appear here.</p>}
      </div>
      <p className="tayyar-chat-sidebar-label">YOUR STUDY CONTEXT</p>
      <div className="tayyar-chat-context"><span className="tayyar-chat-context-icon"><GraduationCap /></span><div><strong>{studyContext.university || "Your university"}</strong><small>{studyContext.program || "Add your program in profile"}</small></div></div>
      <div className="tayyar-chat-sidebar-section"><div className="tayyar-chat-sidebar-heading"><span>Subjects</span><span>{subjects.length}</span></div>{subjects.length ? subjects.slice(0, 5).map((subject) => <div className="tayyar-chat-sidebar-subject" key={subject.id}><BookOpen /><span>{subject.name}</span></div>) : <p className="tayyar-chat-sidebar-empty">Add a subject to make your study guidance more personal.</p>}</div>
      <div className="tayyar-chat-sidebar-section"><div className="tayyar-chat-sidebar-heading"><span>Needs attention</span><span>{weakTopics.length}</span></div>{weakTopics.length ? weakTopics.slice(0, 4).map((topic: any) => <div className="tayyar-chat-weak-topic" key={`${topic.subject}-${topic.topic}`}><Target /><span>{topic.topic}</span><small>{topic.mastery}%</small></div>) : <p className="tayyar-chat-sidebar-empty">Practice a few quizzes to identify focus topics.</p>}</div>
      <div className="tayyar-chat-sidebar-footer"><span className="tayyar-user-avatar">{(user?.full_name || "S").slice(0, 1).toUpperCase()}</span><span><strong>{user?.full_name || user?.username || "Student"}</strong><small>Student account</small></span><button type="button" aria-label="Sign out" onClick={logout}><LogOut /></button></div>
    </aside>

    <section className="tayyar-chat-main">
      <header className="tayyar-chat-header"><button type="button" className="tayyar-chat-mobile-menu" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle chat menu"><Search /></button><div><p className="tayyar-chat-eyebrow"><span /> YOUR STUDY COMPANION</p><h1>Chat with Tayyar</h1></div><div className="tayyar-chat-context-badge"><Sparkles />{loadingContext ? "Loading your study context" : `${subjects.length} subject${subjects.length === 1 ? "" : "s"} connected`}</div></header>
      <div className="tayyar-chat-scroll">
        {!messages.length ? <div className="tayyar-chat-empty"><div className="tayyar-chat-orb"><Sparkles /></div><p className="tayyar-chat-eyebrow">YOUR COURSEWORK, IN CONTEXT</p><h2>What would you like<br /><span>to work through?</span></h2><p className="tayyar-chat-empty-copy">Ask about a topic, get help planning practice, or talk through a previous mistake. Tayyar can use your saved subjects and weak-topic history.</p>
          <div className="tayyar-chat-suggestions">{suggestions.map(({ icon: Icon, title, prompt }) => <button type="button" key={title} onClick={() => void sendMessage(prompt)}><span><Icon /></span><strong>{title}</strong><ArrowRightSmall /></button>)}</div>
          {!subjects.length && <Link href="/dashboard/new-subject" className="tayyar-chat-add-subject">Add your first subject <ArrowRightSmall /></Link>}
        </div> : <div className="tayyar-chat-messages">{messages.map((message) => <article key={message.id} className={`tayyar-chat-message ${message.role}`}><span className="tayyar-chat-message-avatar">{message.role === "assistant" ? <Sparkles /> : (user?.full_name || "S").slice(0, 1).toUpperCase()}</span><div><small>{message.role === "assistant" ? "Tayyar STUDY COMPANION" : "YOU"}</small><p>{message.text}</p></div></article>)}{sending && <div className="tayyar-chat-typing"><span /><span /><span /> Tayyar is thinking about your study context…</div>}<div ref={endRef} /></div>}
      </div>
      <div className="tayyar-chat-composer-wrap"><form className="tayyar-chat-composer" onSubmit={onSubmit}><textarea rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask about your course, a weak topic, or what to study next…" aria-label="Message Tayyar" /><button type="submit" disabled={!draft.trim() || sending} aria-label="Send message">{sending ? <Loader2 className="animate-spin" /> : <ArrowUp />}</button></form><p>Enter to send · Shift + Enter for a new line · Tayyar uses saved study context; verify current admissions details with the university.</p>{error && <div className="tayyar-chat-error" role="alert">{error}</div>}</div>
    </section>
  </main>
}

function ArrowRightSmall() { return <ArrowUp className="rotate-45" /> }
