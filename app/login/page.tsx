"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, BookOpen, Brain, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { StudyLoader } from "@/components/ui/study-loader"
import ThemeToggle from "@/components/theme-toggle"

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

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
                

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">continue with email</span>
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
                        className="pl-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="pl-10 pr-10 h-12 bg-background border-border focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <Link href="/" className="tayyar-auth-side-brand"><span className="tayyar-brand-glyph">T</span><span className="tayyar-brand-copy"><strong>Tayyar</strong><small>AI EXAM PREPARATION</small></span></Link>
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
