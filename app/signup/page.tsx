"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, EyeOff, User, Mail, Lock, Chrome, Loader2, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { StudyLoader } from "@/components/ui/study-loader"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

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
  
  const { signup, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
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
      await signup({
        full_name: formData.username, // Use username as full name
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
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
          text="Loading signup page..."
        />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl ">
          {/* Header */}
          <div className="text-center space-y-4 ">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Join Study Mode Agent</h1>
              <p className="text-muted-foreground mt-2">Start your AI-powered learning journey today</p>
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

      {/* Right Side - Education Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5">
        <div className="w-full max-w-lg space-y-8">
          {/* Education Icons */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-chart-1/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Learn</h3>
              <p className="text-sm text-muted-foreground">Master concepts with AI guidance</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-chart-2/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Practice</h3>
              <p className="text-sm text-muted-foreground">Interactive quizzes and exercises</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-chart-3/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Track</h3>
              <p className="text-sm text-muted-foreground">Monitor your learning progress</p>
            </div>
          </div>

          {/* AI Brain Visual */}
          <div className="text-center space-y-4">
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
              <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered Learning</h2>
              <p className="text-muted-foreground">Experience personalized education with our advanced AI system that adapts to your learning style and pace.</p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-chart-1"></div>
              <span>Personalized study plans</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-chart-2"></div>
              <span>Interactive quizzes and assessments</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-chart-3"></div>
              <span>Real-time progress tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-chart-4"></div>
              <span>Smart recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
