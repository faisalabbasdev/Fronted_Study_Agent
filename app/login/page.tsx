"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Chrome, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { StudyLoader } from "@/components/ui/study-loader"

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
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">Continue your AI-powered learning journey</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                <span>Interactive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                <span>Smart</span>
              </div>
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

      {/* Right Side - Education Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5">
        <div className="w-full max-w-lg space-y-8">
          {/* Welcome Back Visual */}
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chart-1/20 to-chart-2/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-chart-1/30 to-chart-2/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-chart-1/40 to-chart-2/40 flex items-center justify-center">
                <svg className="w-12 h-12 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h2>
              <p className="text-muted-foreground">Continue your personalized learning journey with AI-powered insights and interactive content.</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center">Your Learning Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Study Sessions</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-1 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quiz Completion</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Learning Streak</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground text-center">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-chart-1/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-xs text-foreground font-medium">Continue Learning</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-chart-2/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-foreground font-medium">Take Quiz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
