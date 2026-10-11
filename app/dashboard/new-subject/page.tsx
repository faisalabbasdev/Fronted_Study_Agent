"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, GraduationCap, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudyLoader } from "@/components/ui/study-loader"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { universities } from "@/lib/universities"

const semesters = Array.from({ length: 12 }, (_, index) => String(index + 1))

export default function NewSubjectPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [university, setUniversity] = useState("")
  const [otherUniversity, setOtherUniversity] = useState("")
  const [program, setProgram] = useState("")
  const [semester, setSemester] = useState("")
  const [examDate, setExamDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { if (!isLoading && !isAuthenticated) router.replace("/login") }, [isAuthenticated, isLoading, router])
  useEffect(() => {
    const profile = user?.preferences?.onboarding
    if (!profile) return
    if (profile.university) {
      const listed = universities.find((item) => item.name.toLocaleLowerCase() === profile.university.trim().toLocaleLowerCase())
      setUniversity(listed ? listed.name : "__other__")
      if (!listed) setOtherUniversity(profile.university)
    }
    if (profile.program) setProgram(profile.program)
    if (profile.semester) setSemester(String(profile.semester).replace(/^Semester\s*/i, ""))
  }, [user])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    setSaving(true); setError("")
    try {
      await apiClient.createLearningSubject({ name: name.trim(), university: university === "__other__" ? otherUniversity.trim() : university, program: program.trim(), semester: semester ? `Semester ${semester}` : "", exam_date: examDate || null })
      router.replace("/dashboard/subjects")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add this subject. Please retry.") }
    finally { setSaving(false) }
  }

  if (isLoading || !isAuthenticated) return <div className="grid min-h-[65vh] place-items-center"><StudyLoader size="xl" variant="detailed" text="Preparing your study space…" /></div>

  return <main className="tayyar-dashboard min-h-screen px-4 py-5 sm:px-7 lg:px-10 lg:py-10">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between"><Link href="/dashboard/subjects" className="tayyar-back-link"><ArrowLeft />Back to subjects</Link><ThemeToggle /></div>
      <header className="mb-7"><p className="tayyar-eyebrow">YOUR COURSEWORK · NEW SUBJECT</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Set up a subject.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Add the course details Tayyar needs to organize material, quizzes, and your exam countdown.</p></header>
      <form onSubmit={onSubmit} className="tayyar-subject-form tayyar-panel p-5 sm:p-8">
        <div className="mb-6 flex items-start gap-3"><span className="tayyar-icon-tile"><BookOpen /></span><div><h2 className="font-semibold">Course details</h2><p className="mt-1 text-sm text-muted-foreground">You can update these later by adding another subject.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="tayyar-form-field sm:col-span-2">SUBJECT NAME<Input required autoFocus maxLength={120} placeholder="e.g. Data Science" value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="tayyar-form-field">UNIVERSITY<select required value={university} onChange={(event) => setUniversity(event.target.value)}><option value="" disabled>Select your university</option>{universities.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}<option value="__other__">Other / not listed</option></select></label>
          <label className="tayyar-form-field">PROGRAM / DEGREE<Input required placeholder="e.g. BS Software Engineering" value={program} onChange={(event) => setProgram(event.target.value)} /></label>
          {university === "__other__" && <label className="tayyar-form-field sm:col-span-2">UNIVERSITY NAME<Input required placeholder="Enter your university name" value={otherUniversity} onChange={(event) => setOtherUniversity(event.target.value)} /></label>}
          <label className="tayyar-form-field">SEMESTER<select required value={semester} onChange={(event) => setSemester(event.target.value)}><option value="" disabled>Select semester</option>{semesters.map((value) => <option value={value} key={value}>Semester {value}</option>)}</select></label>
          <label className="tayyar-form-field">EXAM DATE <span className="tayyar-field-optional">Optional</span><span className="tayyar-date-field"><CalendarDays /><input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} /></span></label>
        </div>
        <div className="tayyar-subject-form-note"><GraduationCap /><p><strong>Need to confirm an academic detail?</strong><span>Browse verified university program and admission links before adding your course.</span></p><Link href="/universities" aria-label="Search universities"><Search /><span>Find university</span><ArrowRight /></Link></div>
        {error && <p role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" asChild><Link href="/dashboard/subjects">Cancel</Link></Button><Button type="submit" disabled={saving || !name.trim() || !university || !program.trim() || !semester} className="min-h-11">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{saving ? "Saving subject…" : "Save subject"}{!saving && <ArrowRight className="ml-2 h-4 w-4" />}</Button></div>
      </form>
    </div>
  </main>
}
