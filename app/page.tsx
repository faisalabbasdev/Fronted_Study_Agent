"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudyLoader, FullPageStudyLoader } from "@/components/ui/study-loader"
import { LEDVideo } from "@/components/ui/led-video"
import { LEDDemo } from "@/components/ui/led-demo"
import { useLoading } from "@/contexts/LoadingContext"
import Image from "next/image"
import { 
  Brain, 
  BookOpen, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  MessageCircle,
  TrendingUp,
  Clock,
  User
} from "lucide-react"

export default function HomePage() {
  const { showFullPageLoader } = useLoading()

  const handleDemoLoader = () => {
    showFullPageLoader("Loading your personalized study experience...")
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl text-center pt-12 md:pt-16">
        <Badge variant="secondary" className="mb-6">
          <Brain className="w-4 h-4 mr-2" />
          AI-Powered Learning Platform
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Study Smarter with Your AI Study Agent
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Transform your learning experience with personalized AI explanations, adaptive quizzes, 
          and intelligent study modes designed to help you master any subject faster.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto">
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
        
      
        <div className="mt-8 flex items-center justify-center gap-x-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            14-day free trial
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Cancel anytime
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Study Mode Agent?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform adapts to your learning style and helps you achieve your academic goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Brain,
              title: "AI-Powered Explanations",
              description: "Get personalized explanations tailored to your learning style and comprehension level.",
              gradient: "from-blue-500 to-cyan-600",
              bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
            },
            {
              icon: Target,
              title: "Adaptive Learning",
              description: "Our AI adjusts difficulty and content based on your progress and performance.",
              gradient: "from-green-500 to-emerald-600",
              bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
            },
            {
              icon: BookOpen,
              title: "Multiple Study Modes",
              description: "Choose from Beginner, Practice, and Exam modes to match your learning goals.",
              gradient: "from-purple-500 to-indigo-600",
              bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20"
            },
            {
              icon: BarChart3,
              title: "Progress Analytics",
              description: "Track your learning journey with detailed analytics and performance insights.",
              gradient: "from-orange-500 to-amber-600",
              bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20"
            },
            {
              icon: Zap,
              title: "Instant Feedback",
              description: "Get immediate feedback on quizzes and practice problems to accelerate learning.",
              gradient: "from-yellow-500 to-orange-600",
              bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20"
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your data is protected with enterprise-grade security and privacy measures.",
              gradient: "from-red-500 to-pink-600",
              bgGradient: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
            }
          ].map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:scale-105">
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-white/10`}>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-inner`}>
                    <feature.icon className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                </div>
                <CardTitle className={`text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mt-20 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Study Mode Agent</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Revolutionizing education through artificial intelligence and personalized learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-muted-foreground mb-6">
                We believe that every student deserves personalized, adaptive learning experiences that 
                cater to their unique learning style and pace. Our AI-powered platform makes this vision a reality.
              </p>
              <p className="text-muted-foreground mb-6">
                Study Mode Agent combines cutting-edge artificial intelligence with proven educational 
                methodologies to create an intelligent learning companion that adapts to each student's needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Personalized learning paths for every student</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>AI-powered explanations and feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Adaptive difficulty and content</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time progress tracking</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <LEDDemo
                className="w-full h-80"
                width={400}
                height={300}
                ledIntensity="medium"
                ledColor="blue"
              />
              {/* Overlay Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl px-6 py-4">
                  <h4 className="text-xl font-semibold mb-2 text-white">AI-Powered Learning</h4>
                  <p className="text-white/90">Intelligent, adaptive, and personalized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mt-20 py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6">
                 <div className="text-center mb-16">
                   <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
                   <p className="mt-4 text-lg text-muted-foreground">
                     Choose the plan that fits your learning goals. No hidden fees, no surprises.
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for trying out our platform",
                features: [
                  "5 study sessions per month",
                  "Basic AI explanations",
                  "3 study subjects",
                  "Community support",
                  "Mobile app access"
                ],
                buttonText: "Get Started",
                buttonVariant: "outline" as const,
                popular: false
              },
              {
                name: "Pro",
                price: "$19",
                period: "per month",
                description: "Most popular for serious learners",
                features: [
                  "Unlimited study sessions",
                  "Advanced AI explanations",
                  "All study subjects",
                  "Priority support",
                  "Progress analytics",
                  "Custom study plans",
                  "Export study materials"
                ],
                buttonText: "Start Free Trial",
                buttonVariant: "default" as const,
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For schools and organizations",
                features: [
                  "Everything in Pro",
                  "Team management",
                  "Advanced analytics",
                  "Custom integrations",
                  "Dedicated support",
                  "White-label options",
                  "API access"
                ],
                buttonText: "Contact Sales",
                buttonVariant: "outline" as const,
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  >
                    <Link href={plan.name === "Free" ? "/signup" : plan.name === "Pro" ? "/signup" : "/contact"}>
                      {plan.buttonText}
                    </Link>
            </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Secure payment
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                24/7 support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-20 py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes and experience the future of learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Sign Up & Choose Subjects",
                description: "Create your account and select the subjects you want to study. Our AI will create a personalized learning plan.",
                icon: User,
                gradient: "from-blue-500 to-purple-600",
                bgGradient: "from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
              },
              {
                step: "02",
                title: "Start Learning with AI",
                description: "Get explanations, take quizzes, and practice with our AI assistant that adapts to your learning pace.",
                icon: Brain,
                gradient: "from-green-500 to-emerald-600",
                bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
              },
              {
                step: "03",
                title: "Track Your Progress",
                description: "Monitor your improvement with detailed analytics and get recommendations for areas to focus on.",
                icon: TrendingUp,
                gradient: "from-orange-500 to-red-600",
                bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.bgGradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-white/20 dark:border-white/10`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-inner`}>
                    <step.icon className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-2`}>{step.step}</div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-foreground transition-colors">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Modes Section */}
      <section className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Study Modes for Every Need</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the perfect learning mode for your goals and current level
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Beginner Mode",
              description: "Perfect for learning new concepts with simple explanations and step-by-step guidance.",
              features: ["Basic explanations", "Step-by-step guidance", "Visual learning aids"],
              gradient: "from-blue-500 to-cyan-600",
              bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
              icon: BookOpen
            },
            {
              title: "Practice Mode",
              description: "Build skills with targeted problems, hints, and adaptive difficulty adjustment.",
              features: ["Targeted problems", "Smart hints", "Adaptive difficulty"],
              gradient: "from-green-500 to-teal-600",
              bgGradient: "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
              icon: Target
            },
            {
              title: "Exam Mode",
              description: "Simulate real test conditions with timed assessments and instant feedback.",
              features: ["Timed assessments", "Real test simulation", "Instant feedback"],
              gradient: "from-purple-500 to-pink-600",
              bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
              icon: Clock
            }
          ].map((mode, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:scale-105">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.bgGradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-white/10`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center shadow-inner`}>
                    <mode.icon className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                </div>
                <CardTitle className={`text-xl font-bold bg-gradient-to-r ${mode.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>{mode.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed">{mode.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mode.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm group/feature">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${mode.gradient} flex items-center justify-center shadow-sm`}>
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="group-hover/feature:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link href="/study-modes">Try {mode.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Students Say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of students who have transformed their learning experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { 
              name: "Usama latief", 
              role: "MIT Student",
              quote: "Raised my exam score by 14% in two weeks. The AI explanations are incredibly clear and helpful.", 
              subject: "Calculus I",
              image: "/images/usama.png",
              rating: 5
            },
            { 
              name: "Talha Riaz", 
              role: "Stanford Student",
              quote: "Practice Mode's hints are insanely helpful. I went from failing to acing my organic chemistry exams.", 
              subject: "Organic Chemistry",
              image: "/images/talha.png",
              rating: 5
            },
            { 
              name: "Farooq Tariq ", 
              role: "High School Senior",
              quote: "Exam Mode feels like the real test. It helped me build confidence and improve my time management.", 
              subject: "AP Physics",
              image: "/images/farooq.png",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">  <Image className="rounded-full" src={testimonial.image} alt={testimonial.name} width={48} height={48} /></span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm italic">"{testimonial.quote}"</p>
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {testimonial.subject}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-20 py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                number: "10,000+", 
                label: "Active Students", 
                icon: Users,
                gradient: "from-blue-500 to-purple-600",
                bgGradient: "from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
              },
              { 
                number: "95%", 
                label: "Success Rate", 
                icon: Award,
                gradient: "from-green-500 to-emerald-600",
                bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
              },
              { 
                number: "50+", 
                label: "Subjects Covered", 
                icon: BookOpen,
                gradient: "from-orange-500 to-red-600",
                bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20"
              },
              { 
                number: "24/7", 
                label: "AI Support", 
                icon: Clock,
                gradient: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-18 h-18 mx-auto rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-white/20 dark:border-white/10`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-inner`}>
                    <stat.icon className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>{stat.number}</div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Learning?</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of students who are already experiencing the future of education with Study Mode Agent.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button asChild size="lg" className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-6 py-4 sm:px-8 sm:py-6 w-full sm:w-auto">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  )
}
