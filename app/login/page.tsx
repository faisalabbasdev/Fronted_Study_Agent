"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, BookOpen, Brain, FileText, Check, Copy, Sparkles, ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { StudyLoader } from "@/components/ui/study-loader"
import ThemeToggle from "@/components/theme-toggle"
import BrandLogo from "@/components/brand-logo"
import toast from "react-hot-toast"

const DEMO_CREDENTIALS = {
  email: "test123@gmail.com",
  username: "test123",
  password: "test@123",
}

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isFilledFeedback, setIsFilledFeedback] = useState(false)
  
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text)
      setCopiedField(label)
      toast.success(`Copied ${label} to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleFillDemo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    setFormData({
      username: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    })
    setIsFilledFeedback(true)
    toast.success("Demo credentials loaded into form!")
    setTimeout(() => setIsFilledFeedback(false), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      return
    }

    try {
      setIsSubmitting(true)
      await login(formData)
      router.push("/dashboard")
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Loading login page..."
        />
      </main>
    )
  }

  return (
    <div className="tayyar-auth-page tayyar-login-page min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="tayyar-auth-theme-toggle"><ThemeToggle /></div>
        <div className="tayyar-auth-form-shell w-full max-w-lg space-y-7">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="tayyar-mini-label justify-center">SIGN IN</p>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Continue your study plan and pick up where you left off.</p>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Accurate Demo Credentials Badge Card - Clickable to fill immediately */}
                <div
                  onClick={handleFillDemo}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleFillDemo() }}
                  title="Click badge anywhere to auto-fill demo credentials"
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.03] to-transparent dark:bg-emerald-950/30 p-4 sm:p-5 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.99] select-none"
                >
                  {/* Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                        Database Demo Account
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 group-hover:bg-emerald-500/25 transition-colors">
                      <Sparkles className="h-3 w-3 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                      <span>Click Badge to Fill</span>
                    </span>
                  </div>

                  {/* Credentials Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {/* Email / Username Tile */}
                    <div
                      onClick={(e) => { e.stopPropagation(); handleFillDemo(); }}
                      className="flex items-center justify-between rounded-xl bg-background/90 dark:bg-black/60 border border-emerald-500/25 dark:border-border/70 px-3 py-2 hover:border-emerald-500 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">Demo Email / User</p>
                        <p className="font-mono text-[12px] text-foreground font-semibold truncate" title={DEMO_CREDENTIALS.email}>
                          {DEMO_CREDENTIALS.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(DEMO_CREDENTIALS.email, "email"); }}
                        title="Copy email"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-emerald-500/15"
                      >
                        {copiedField === "email" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Password Tile */}
                    <div
                      onClick={(e) => { e.stopPropagation(); handleFillDemo(); }}
                      className="flex items-center justify-between rounded-xl bg-background/90 dark:bg-black/60 border border-emerald-500/25 dark:border-border/70 px-3 py-2 hover:border-emerald-500 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">Demo Password</p>
                        <p className="font-mono text-[12px] text-foreground font-semibold truncate">
                          {DEMO_CREDENTIALS.password}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(DEMO_CREDENTIALS.password, "password"); }}
                        title="Copy password"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-emerald-500/15"
                      >
                        {copiedField === "password" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions / Note */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-emerald-500/15">
                    <p className="text-[11px] text-muted-foreground">
                      Verified in database. Click badge anywhere to fill and sign in.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); handleFillDemo(); }}
                      className="h-8 px-3 text-xs font-semibold border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500 flex items-center justify-center gap-1.5 shrink-0 rounded-lg shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span>Auto-Fill Credentials</span>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">or sign in manually</span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Username/Email */}
            <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username or Email
              </label>
              <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="username" 
                  name="username"
                  type="text" 
                  placeholder="Enter your username or email" 
                  className={`pl-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${isFilledFeedback ? 'ring-2 ring-emerald-500/80 border-emerald-500 bg-emerald-500/[0.05]' : ''}`}
                  value={formData.username}
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
                  type={show ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className={`pl-10 pr-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${isFilledFeedback ? 'ring-2 ring-emerald-500/80 border-emerald-500 bg-emerald-500/[0.05]' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

                  {/* Forgot Password */}
            <div className="text-right">
                    <Link href="#" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
                </div>

                {/* Submit Button */}
            <Button 
              type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
              disabled={isSubmitting || !formData.username || !formData.password}
            >
              {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <StudyLoader size="sm" variant="minimal" />
                      <span>Signing in...</span>
                    </div>
              ) : (
                "Sign In"
              )}
            </Button>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-muted-foreground">
                  New here?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Create an account
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <aside className="tayyar-login-side">
        <div className="tayyar-login-side-content">
          <Link href="/" className="tayyar-auth-side-brand" aria-label="Tayyar home"><BrandLogo className="h-16 w-48 object-contain" priority /></Link>
          <p className="tayyar-auth-side-pill"><Brain /> YOUR STUDY SPACE, READY</p>
          <h2>Your course material,<br /><span>put to better use.</span></h2>
          <p className="tayyar-login-side-lede">Pick up where you left off: review a mistake, practice a weak topic, or prepare for an upcoming exam.</p>
          <div className="tayyar-login-benefits">
            <div><span><FileText /></span><p><strong>Practice from your PDFs</strong><small>Keep questions connected to the materials you study from.</small></p></div>
            <div><span><Brain /></span><p><strong>Remember what needs work</strong><small>Use your quiz history to return to weaker topics and mistakes.</small></p></div>
            <div><span><BookOpen /></span><p><strong>Choose your next session</strong><small>Recommendations use recent results, review timing, and exam dates.</small></p></div>
          </div>
          <p className="tayyar-login-side-foot"><span /> A calmer way to prepare, one focused session at a time.</p>
        </div>
      </aside>
    </div>
  )
}
