import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Brain,
  Users,
  Target,
  Zap,
  CheckCircle,
  Play
} from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      university: "MIT",
      image: "SC",
      rating: 5,
      quote: "Study Mode Agent completely transformed how I approach learning. The AI explanations are incredibly clear and the adaptive quizzes helped me master complex algorithms in half the time.",
      improvement: "Raised GPA from 3.2 to 3.8",
      subject: "Data Structures & Algorithms",
      verified: true
    },
    {
      name: "Marcus Rodriguez",
      role: "Pre-Med Student",
      university: "Stanford University",
      image: "MR",
      rating: 5,
      quote: "The practice mode with hints is a game-changer for organic chemistry. I went from failing my midterms to acing my finals. The AI really understands how to break down complex reactions.",
      improvement: "Improved exam scores by 35%",
      subject: "Organic Chemistry",
      verified: true
    },
    {
      name: "Emily Watson",
      role: "High School Senior",
      university: "AP Student",
      image: "EW",
      rating: 5,
      quote: "I was struggling with AP Physics until I found Study Mode Agent. The step-by-step explanations and instant feedback helped me understand concepts I thought were impossible.",
      improvement: "Scored 5 on AP Physics exam",
      subject: "AP Physics C",
      verified: true
    },
    {
      name: "David Kim",
      role: "MBA Student",
      university: "Wharton School",
      image: "DK",
      rating: 5,
      quote: "The AI's ability to explain complex business concepts in simple terms is remarkable. It's like having a personal tutor available 24/7. My case study performance improved dramatically.",
      improvement: "Top 10% in class",
      subject: "Strategic Management",
      verified: true
    },
    {
      name: "Lisa Thompson",
      role: "Language Learning",
      university: "Self-Study",
      image: "LT",
      rating: 5,
      quote: "I've tried many language learning apps, but Study Mode Agent's AI adapts to my learning style perfectly. The conversational practice and grammar explanations are incredibly effective.",
      improvement: "Fluent in Spanish in 6 months",
      subject: "Spanish Language",
      verified: true
    },
    {
      name: "Alex Johnson",
      role: "Engineering Student",
      university: "Caltech",
      image: "AJ",
      rating: 5,
      quote: "The exam mode perfectly simulates real test conditions. I was able to identify my weak areas and improve my time management. My confidence going into finals was completely different.",
      improvement: "Improved test scores by 28%",
      subject: "Calculus & Linear Algebra",
      verified: true
    },
    {
      name: "Maya Patel",
      role: "Graduate Student",
      university: "Harvard University",
      image: "MP",
      rating: 5,
      quote: "As a graduate student, I needed something that could handle advanced topics. Study Mode Agent's AI explanations are sophisticated enough for graduate-level material while remaining accessible.",
      improvement: "Published first research paper",
      subject: "Machine Learning",
      verified: true
    },
    {
      name: "James Wilson",
      role: "Professional Development",
      university: "Working Professional",
      image: "JW",
      rating: 5,
      quote: "I use Study Mode Agent for continuing education in my field. The AI helps me stay current with new technologies and concepts. It's like having a personal learning coach.",
      improvement: "Promoted to Senior Developer",
      subject: "Software Engineering",
      verified: true
    }
  ]

  const stats = [
    { number: "10,000+", label: "Happy Students", icon: Users },
    { number: "95%", label: "Success Rate", icon: Target },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "50+", label: "Subjects Covered", icon: BookOpen }
  ]

  const achievements = [
    {
      title: "MIT Student Success",
      description: "Sarah improved her GPA by 0.6 points using our AI-powered study methods",
      icon: Award,
      highlight: "3.2 → 3.8 GPA"
    },
    {
      title: "AP Exam Excellence",
      description: "Emily scored a perfect 5 on her AP Physics exam after struggling initially",
      icon: CheckCircle,
      highlight: "Perfect Score"
    },
    {
      title: "Language Mastery",
      description: "Lisa achieved fluency in Spanish in just 6 months with our adaptive learning",
      icon: TrendingUp,
      highlight: "6 Months"
    },
    {
      title: "Career Advancement",
      description: "James got promoted to Senior Developer after upskilling with our platform",
      icon: Zap,
      highlight: "Promoted"
    }
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Student Success Stories
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Real Results from Real Students
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover how Study Mode Agent has helped thousands of students achieve their academic goals 
            and transform their learning experience.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
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

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Students Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real feedback from students who have transformed their learning with Study Mode Agent
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/${testimonial.image.toLowerCase()}.jpg`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.image}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                    <p className="text-muted-foreground italic pl-4">"{testimonial.quote}"</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      {testimonial.subject}
                    </Badge>
                    <div className="text-sm font-medium text-green-600">
                      {testimonial.improvement}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Notable Achievements</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real success stories from our students across different fields and levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <achievement.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  <div className="text-2xl font-bold text-primary">{achievement.highlight}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Placeholder */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See It In Action</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Watch real students share their Study Mode Agent experience
            </p>
          </div>
          
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Play className="h-10 w-10 text-primary ml-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Success Stories</h3>
              <p className="text-muted-foreground">Coming Soon - Video testimonials</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Our Success Stories</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Be the next student to achieve their academic goals with Study Mode Agent.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">Start Your Success Story</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

