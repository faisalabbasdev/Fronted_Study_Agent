import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  BookOpen, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Award,
  Lightbulb,
  TrendingUp,
  Clock
} from "lucide-react"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Learning Platform
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Revolutionizing Education with AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Study Mode Agent combines cutting-edge artificial intelligence with proven learning methodologies 
            to create personalized, adaptive learning experiences that help students achieve their academic goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/signup">Start Learning Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            To democratize access to high-quality, personalized education by leveraging artificial intelligence 
            to create adaptive learning experiences that meet every student where they are and help them reach 
            their full potential.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Study Mode Agent?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform offers comprehensive AI-powered learning tools designed for modern students
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Powered Explanations",
                description: "Get personalized explanations tailored to your learning style and comprehension level."
              },
              {
                icon: Target,
                title: "Adaptive Learning",
                description: "Our AI adjusts difficulty and content based on your progress and performance."
              },
              {
                icon: BookOpen,
                title: "Multiple Study Modes",
                description: "Choose from Beginner, Practice, and Exam modes to match your learning goals."
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description: "Track your learning journey with detailed analytics and performance insights."
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                description: "Get immediate feedback on quizzes and practice problems to accelerate learning."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data is protected with enterprise-grade security and privacy measures."
              }
            ].map((feature, index) => (
              <Card key={index} className="group  transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12  flex items-center justify-center  transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "10,000+", label: "Active Students", icon: Users },
              { number: "95%", label: "Success Rate", icon: Award },
              { number: "50+", label: "Subjects Covered", icon: BookOpen },
              { number: "24/7", label: "AI Support", icon: Clock }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powered by Advanced AI</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Our platform leverages state-of-the-art artificial intelligence technologies to deliver 
                personalized learning experiences that adapt to each student's unique needs and learning pace.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Natural Language Processing for intelligent explanations",
                  "Machine Learning algorithms for adaptive difficulty",
                  "Computer Vision for visual learning aids",
                  "Predictive Analytics for learning path optimization"
                ].map((tech, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">AI Learning Engine</h3>
                  <p className="text-muted-foreground mt-2">Continuously learning and improving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Passionate educators and technologists working together to transform learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Chief Learning Officer",
                description: "Former MIT professor with 15+ years in educational technology",
                image: "👩‍💼"
              },
              {
                name: "Marcus Rodriguez",
                role: "Head of AI Research",
                description: "AI researcher specializing in natural language processing",
                image: "👨‍💻"
              },
              {
                name: "Dr. Emily Watson",
                role: "Director of Product",
                description: "Learning experience designer and cognitive science expert",
                image: "👩‍🎓"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl mb-4">
                    {member.image}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Learning?</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of students who are already experiencing the future of education with Study Mode Agent.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/testimonials">Read Success Stories</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
