"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, Eye, EyeOff, FileText, GraduationCap, Lock, Mail, Search, Share2, User, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { StudyLoader } from "@/components/ui/study-loader"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import ThemeToggle from "@/components/theme-toggle"

type OnboardingAnswers = { step: number; name: string; studyContext: string; university: string; program: string; semester: string; source: string }
const onboardingKey = "tayyar-onboarding-draft"
const initialOnboarding: OnboardingAnswers = { step: 1, name: "", studyContext: "University / college", university: "", program: "", semester: "", source: "" }

export default function SignupPage() {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [onboardingFlow, setOnboardingFlow] = useState(false)
  const [onboarding, setOnboarding] = useState<OnboardingAnswers>(initialOnboarding)
  const [onboardingSaving, setOnboardingSaving] = useState(false)
  const [onboardingError, setOnboardingError] = useState("")
  
  const { signup, isAuthenticated, isLoading, user, refreshUser } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const savedDraft = sessionStorage.getItem(onboardingKey)
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft) as OnboardingAnswers
          setOnboarding(parsed)
          setOnboardingFlow(true)
        } catch { sessionStorage.removeItem(onboardingKey); router.replace("/dashboard") }
      } else router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  const strength = (() => {
    let s = 0
    if (formData.password.length >= 8) s += 30
    if (/[A-Z]/.test(formData.password)) s += 20
    if (/[0-9]/.test(formData.password)) s += 20
    if (/[^A-Za-z0-9]/.test(formData.password)) s += 30
    return Math.min(s, 100)
  })()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password) {
      return "All fields are required"
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address"
    }
    if (formData.username.length < 3) {
      return "Username must be at least 3 characters long"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      return
    }

    try {
      setIsSubmitting(true)
      sessionStorage.setItem(onboardingKey, JSON.stringify(initialOnboarding))
      await signup({
        full_name: formData.username, // Use username as full name
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
      setOnboarding(initialOnboarding)
      setOnboardingFlow(true)
    } catch (error) {
      sessionStorage.removeItem(onboardingKey)
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateOnboarding = (patch: Partial<OnboardingAnswers>) => setOnboarding((current) => {
    const next = { ...current, ...patch }
    sessionStorage.setItem(onboardingKey, JSON.stringify(next))
    return next
  })

  const finishOnboarding = async () => {
    if (onboarding.name.trim().length < 2) { setOnboardingError("Please enter the name you’d like us to use."); return }
    if (!onboarding.studyContext) { setOnboardingError("Choose the option that best describes your study plans."); return }
    if (!onboarding.source) { setOnboardingError("Choose how you heard about Tayyar."); return }
    setOnboardingSaving(true); setOnboardingError("")
    try {
      const preferences = {
        ...(user?.preferences || {}),
        onboarding: {
          completed: true,
          completed_at: new Date().toISOString(),
          study_context: onboarding.studyContext,
          university: onboarding.university.trim() || null,
          program: onboarding.program.trim() || null,
          semester: onboarding.semester.trim() || null,
          discovery_source: onboarding.source,
        },
      }
      await apiClient.updateCurrentUser({ full_name: onboarding.name.trim(), preferences })
      await refreshUser()
      sessionStorage.removeItem(onboardingKey)
      router.replace("/dashboard")
    } catch (error) {
      setOnboardingError(error instanceof Error ? error.message : "We couldn’t save your study profile. Please try again.")
    } finally { setOnboardingSaving(false) }
  }

  if (onboardingFlow) {
    const options: Array<{ value: string; label: string; detail?: string; icon: typeof Search }> = onboarding.step === 2
      ? [{ value: "University / college", label: "University or college", detail: "Coursework, lectures, and semester exams", icon: GraduationCap }, { value: "Entrance exams", label: "Entrance exam preparation", detail: "Prepare for an upcoming admission test", icon: BookOpen }, { value: "Independent study", label: "Independent learning", detail: "Build knowledge at your own pace", icon: Users }]
      : [{ value: "Search engine", label: "Search engine", icon: Search }, { value: "Social media", label: "Social media", icon: Share2 }, { value: "Friend / classmate", label: "Friend or classmate", icon: Users }, { value: "Other", label: "Somewhere else", icon: BookOpen }]
    return <main className="tayyar-onboarding-screen">
      <div className="tayyar-onboarding-glow" />
      <div className="tayyar-onboarding-wrap">
        <div className="tayyar-auth-theme-toggle"><ThemeToggle /></div>
        <Link href="/" className="tayyar-onboarding-brand"><span className="tayyar-brand-glyph">T</span><span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span></Link>
        <div className="tayyar-onboarding-progress" aria-label={`Question ${onboarding.step} of 3`}>{[1, 2, 3].map((step) => <span key={step} className={step < onboarding.step ? "is-done" : step === onboarding.step ? "is-current" : ""}>{step < onboarding.step ? <Check /> : step}</span>)}</div>
        <section className="tayyar-onboarding-card" aria-live="polite">
          <p className="tayyar-mini-label">LET’S SET UP YOUR STUDY SPACE · {String(onboarding.step).padStart(2, "0")} / 03</p>
          <h1>{onboarding.step === 1 ? "What should we call you?" : onboarding.step === 2 ? "How will you use Tayyar?" : "How did you hear about us?"}</h1>
          <p className="tayyar-onboarding-description">{onboarding.step === 1 ? "This is how your name will appear across your learning workspace." : onboarding.step === 2 ? "We’ll shape your starting experience around the way you study." : "Your answer helps us make Tayyar easier for more students to find."}</p>

          {onboarding.step === 1 && <div className="tayyar-onboarding-field"><label htmlFor="onboarding-name">YOUR NAME</label><div className="tayyar-onboarding-input-wrap"><User /><input id="onboarding-name" autoFocus autoComplete="name" placeholder="e.g. Ayesha Khan" value={onboarding.name} onChange={(event) => updateOnboarding({ name: event.target.value })} onKeyDown={(event) => { if (event.key === "Enter" && onboarding.name.trim().length >= 2) updateOnboarding({ step: 2 }) }} /></div></div>}

          {onboarding.step === 2 && <><div className="tayyar-onboarding-options">{options.map(({ value, label, detail, icon: Icon }) => <button type="button" key={value} onClick={() => updateOnboarding({ studyContext: value })} className={`tayyar-onboarding-option ${onboarding.studyContext === value ? "is-selected" : ""}`} aria-pressed={onboarding.studyContext === value}><span className="tayyar-onboarding-option-icon"><Icon /></span><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span><span className="tayyar-radio-check">{onboarding.studyContext === value && <Check />}</span></button>)}</div>{onboarding.studyContext === "University / college" && <div className="tayyar-academic-fields"><label>UNIVERSITY <input placeholder="Your university (optional)" value={onboarding.university} onChange={(event) => updateOnboarding({ university: event.target.value })} /></label><label>PROGRAM <input placeholder="e.g. BS Software Engineering" value={onboarding.program} onChange={(event) => updateOnboarding({ program: event.target.value })} /></label><label>SEMESTER <input placeholder="e.g. Semester 5" value={onboarding.semester} onChange={(event) => updateOnboarding({ semester: event.target.value })} /></label></div>}</>}

          {onboarding.step === 3 && <div className="tayyar-onboarding-options">{options.map(({ value, label, icon: Icon }) => <button type="button" key={value} onClick={() => updateOnboarding({ source: value })} className={`tayyar-onboarding-option compact ${onboarding.source === value ? "is-selected" : ""}`} aria-pressed={onboarding.source === value}><span className="tayyar-onboarding-option-icon"><Icon /></span><span><strong>{label}</strong></span><span className="tayyar-radio-check">{onboarding.source === value && <Check />}</span></button>)}</div>}

          {onboardingError && <p role="alert" className="tayyar-onboarding-error">{onboardingError}</p>}
          <div className="tayyar-onboarding-actions">{onboarding.step > 1 && <button type="button" className="tayyar-onboarding-back" onClick={() => { setOnboardingError(""); updateOnboarding({ step: onboarding.step - 1 }) }}><ArrowLeft /> Back</button>}
            {onboarding.step < 3 ? <button type="button" className="tayyar-onboarding-next" onClick={() => { if (onboarding.step === 1 && onboarding.name.trim().length < 2) { setOnboardingError("Please enter at least two characters."); return } setOnboardingError(""); updateOnboarding({ step: onboarding.step + 1 }) }}>Continue <ArrowRight /></button> : <button type="button" className="tayyar-onboarding-next" disabled={onboardingSaving} onClick={() => void finishOnboarding()}>{onboardingSaving ? "Saving your study profile…" : "Finish setup"} {!onboardingSaving && <ArrowRight />}</button>}
          </div>
        </section>
        <p className="tayyar-onboarding-footnote">You can update your study details later from your dashboard.</p>
      </div>
    </main>
  }

  if (isLoading) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Loading signup page..."
        />
      </main>
    )
  }

  return (
    <div className="tayyar-auth-page tayyar-signup-page min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="tayyar-auth-theme-toggle"><ThemeToggle /></div>
        <div className="tayyar-auth-form-shell w-full max-w-lg">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="tayyar-mini-label justify-center">CREATE YOUR STUDY SPACE</p>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Join Tayyar</h1>
              <p className="text-muted-foreground mt-2">A focused place for your course material, practice, and progress.</p>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
               

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground"> sign up with email</span>
                </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Username */}
              <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-foreground">
                      Username
                </label>
                <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

                  {/* Email */}
              <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                </label>
                <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email address" 
                        className="pl-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

                  {/* Password */}
              <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={show1 ? "text" : "password"}
                    placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow1((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                    
                    {/* Password Strength */}
                    <div className="space-y-2">
                <Progress value={strength} className="h-1" />
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-chart-1' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-chart-1' : 'bg-muted'}`} />
                          <span>8+ chars</span>
                        </div>
                        <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'text-chart-2' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) ? 'bg-chart-2' : 'bg-muted'}`} />
                          <span>Mixed</span>
                        </div>
                        <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-chart-3' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-chart-3' : 'bg-muted'}`} />
                          <span>Special</span>
                        </div>
                      </div>
                    </div>
              </div>

                  {/* Confirm Password */}
              <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={show2 ? "text" : "password"} 
                    placeholder="Confirm your password" 
                        className="pl-10 pr-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow2((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline">
                          Terms of Service
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] bg-card border-border shadow-2xl flex flex-col">
                        <DialogHeader className="space-y-4 pb-4 border-b border-border flex-shrink-0">
                          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            Terms of Service
                          </DialogTitle>
                          <DialogDescription className="text-base text-muted-foreground">
                            Study Mode Agent - Educational Platform Terms & Conditions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border/80 flex-1 pr-2">
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-1 flex items-center justify-center text-xs font-bold text-white">1</div>
                              Educational Purpose
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              Study Mode Agent is designed exclusively for educational purposes. As a student, you agree to use this platform to enhance your learning experience through AI-powered study tools, interactive quizzes, and personalized learning paths.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-2 flex items-center justify-center text-xs font-bold text-white">2</div>
                              Student Responsibilities
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              You are responsible for maintaining the accuracy of your academic information and using the platform in accordance with your educational goals. Any misuse of the platform for non-educational purposes is strictly prohibited.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-3 flex items-center justify-center text-xs font-bold text-white">3</div>
                              Privacy and Data Protection
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              We respect your privacy and protect your educational data. Your study progress, quiz results, and learning analytics are used solely to improve your educational experience and provide personalized recommendations.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-4 flex items-center justify-center text-xs font-bold text-white">4</div>
                              Academic Integrity
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              You agree to maintain academic integrity while using our platform. The AI assistant and quiz features are designed to support your learning, not to replace your own academic effort and critical thinking.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">5</div>
                              Platform Usage
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              This platform is intended for students seeking to improve their academic performance through AI-assisted learning. By using Study Mode Agent, you confirm that you are a student or educator using the platform for legitimate educational purposes.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>{" "}
                    and{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline">
                          Privacy Policy
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] bg-card border-border shadow-2xl flex flex-col">
                        <DialogHeader className="space-y-4 pb-4 border-b border-border flex-shrink-0">
                          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            Privacy Policy
                          </DialogTitle>
                          <DialogDescription className="text-base text-muted-foreground">
                            How we protect and manage your educational data
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-border/80 flex-1 pr-2">
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-1 flex items-center justify-center text-xs font-bold text-white">1</div>
                              Data Collection
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              We collect only the information necessary to provide you with personalized educational experiences, including your study progress, quiz performance, and learning preferences. All data collection is transparent and purposeful.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-2 flex items-center justify-center text-xs font-bold text-white">2</div>
                              Data Usage
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              Your data is used exclusively to improve your learning experience through AI-powered recommendations, progress tracking, and personalized study plans. We never use your data for advertising or commercial purposes.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-3 flex items-center justify-center text-xs font-bold text-white">3</div>
                              Data Protection
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your educational data and ensure it remains confidential and secure.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-chart-4 flex items-center justify-center text-xs font-bold text-white">4</div>
                              Student Rights
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              As a student, you have the right to access, modify, or delete your educational data at any time. We will never share your personal academic information with third parties without your explicit consent.
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-accent/50 border border-border/50">
                            <h3 className="font-bold text-lg mb-3 text-foreground flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">5</div>
                              Data Retention
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              We retain your educational data only as long as necessary to provide our services. You can request data deletion at any time, and we will remove your information within 30 days of your request.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </label>
              </div>

                {/* Submit Button */}
              <Button 
                type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
                  disabled={isSubmitting || !formData.email || !formData.username || !formData.password || !formData.confirmPassword}
              >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <StudyLoader size="sm" variant="minimal" />
                      <span>Creating account...</span>
                    </div>
                ) : (
                  "Create Account"
                )}
              </Button>

                {/* Sign In Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
          </form>
            </CardContent>
        </Card>
        </div>
      </div>

      <aside className="tayyar-login-side">
        <div className="tayyar-login-side-content">
          <Link href="/" className="tayyar-auth-side-brand"><span className="tayyar-brand-glyph">T</span><span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span></Link>
          <p className="tayyar-auth-side-pill"><BookOpen /> A STUDY PLAN THAT STARTS WITH YOU</p>
          <h2>Make your study time<br /><span>count for more.</span></h2>
          <p className="tayyar-login-side-lede">Build a study space around your subjects, course material, and the topics you want to strengthen.</p>
          <div className="tayyar-login-benefits">
            <div><span><FileText /></span><p><strong>Bring your course material</strong><small>Keep practice connected to the notes and PDFs you use.</small></p></div>
            <div><span><Brain /></span><p><strong>Learn from each attempt</strong><small>Review quiz results and return to topics that need practice.</small></p></div>
            <div><span><BookOpen /></span><p><strong>Build a steady routine</strong><small>Track your progress and prepare for the exams ahead.</small></p></div>
          </div>
          <p className="tayyar-login-side-foot"><span /> Your progress, your pace, your next step.</p>
        </div>
      </aside>    </div>
  )
}
