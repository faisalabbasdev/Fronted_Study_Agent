import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  BookOpen, 
  Brain, 
  Shield,
  CreditCard,
  Users,
  Zap,
  Target
} from "lucide-react"

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      questions: [
        {
          question: "How do I get started with Study Mode Agent?",
          answer: "Simply sign up for a free account, choose your subjects, and start with our AI-powered study modes. Our platform will guide you through the setup process and create a personalized learning plan based on your goals."
        },
        {
          question: "What subjects are available on the platform?",
          answer: "We cover 50+ subjects including Mathematics, Science, History, Literature, Languages, and more. Our AI can adapt to any subject matter and difficulty level, from elementary to advanced university courses."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Yes! Study Mode Agent is fully responsive and works seamlessly on all devices. You can access your learning materials, take quizzes, and track progress from your phone, tablet, or computer."
        },
        {
          question: "How does the AI determine my learning level?",
          answer: "Our AI analyzes your responses to initial questions, quiz performance, and study patterns to create a personalized learning profile. It continuously adapts as you progress through the material."
        }
      ]
    },
    {
      title: "AI Features",
      icon: Brain,
      questions: [
        {
          question: "How does the AI explanation feature work?",
          answer: "Our AI uses advanced natural language processing to break down complex concepts into easy-to-understand explanations. It adapts its teaching style based on your learning preferences and comprehension level."
        },
        {
          question: "Can the AI help with homework and assignments?",
          answer: "Yes! Our AI can provide step-by-step guidance, hints, and explanations to help you understand concepts and solve problems. However, we encourage learning and understanding rather than just providing answers."
        },
        {
          question: "How accurate are the AI-generated quizzes?",
          answer: "Our AI creates highly accurate quizzes based on the latest educational standards and curriculum. Each quiz is tailored to your current knowledge level and learning objectives."
        },
        {
          question: "Does the AI remember my progress across sessions?",
          answer: "Absolutely! The AI maintains a comprehensive profile of your learning progress, strengths, weaknesses, and preferences across all sessions to provide consistent, personalized support."
        }
      ]
    },
    {
      title: "Study Modes",
      icon: Target,
      questions: [
        {
          question: "What are the different study modes available?",
          answer: "We offer three main study modes: Beginner Mode for foundational learning, Practice Mode for skill building with hints, and Exam Mode for timed assessments that simulate real test conditions."
        },
        {
          question: "Can I switch between study modes during a session?",
          answer: "Yes, you can switch between study modes at any time. The AI will adapt the content and difficulty level to match your selected mode while maintaining your learning progress."
        },
        {
          question: "How does Practice Mode provide hints?",
          answer: "Practice Mode offers contextual hints, step-by-step guidance, and alternative approaches to help you work through problems. The hints become more specific if you're struggling with a particular concept."
        },
        {
          question: "Is Exam Mode timed?",
          answer: "Yes, Exam Mode includes realistic time constraints to help you practice under pressure. You can customize the time limits based on your needs and the type of assessment you're preparing for."
        }
      ]
    },
    {
      title: "Account & Billing",
      icon: CreditCard,
      questions: [
        {
          question: "Is there a free trial available?",
          answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
        },
        {
          question: "Do you offer student discounts?",
          answer: "Yes! We offer special pricing for students with valid student IDs. Contact our support team to learn more about our student discount program."
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      questions: [
        {
          question: "How is my data protected?",
          answer: "We use enterprise-grade encryption and security measures to protect your data. All information is stored securely and never shared with third parties without your explicit consent."
        },
        {
          question: "Can I delete my account and data?",
          answer: "Yes, you can request account deletion at any time. We will permanently remove all your personal data within 30 days of your request, in compliance with privacy regulations."
        },
        {
          question: "Is my learning progress tracked?",
          answer: "Yes, we track your learning progress to provide personalized recommendations and improve our AI. This data is used solely to enhance your learning experience and is never shared externally."
        },
        {
          question: "Can parents monitor their child's progress?",
          answer: "Yes, we offer parent dashboard features that allow parents to monitor their child's learning progress, study time, and achievements while maintaining appropriate privacy controls."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      questions: [
        {
          question: "What if I encounter technical issues?",
          answer: "Our support team is available 24/7 to help with any technical issues. You can reach us through live chat, email, or our support ticket system."
        },
        {
          question: "Do you offer offline access?",
          answer: "Currently, our platform requires an internet connection for full functionality. However, we're working on offline features for basic study materials and note-taking."
        },
        {
          question: "Can I use Study Mode Agent on multiple devices?",
          answer: "Yes! Your account syncs across all devices, so you can seamlessly switch between your phone, tablet, and computer while maintaining your progress and preferences."
        },
        {
          question: "What are the system requirements?",
          answer: "Study Mode Agent works on any modern web browser and all major operating systems. We recommend using the latest version of Chrome, Firefox, Safari, or Edge for the best experience."
        }
      ]
    }
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Everything You Need to Know
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Find answers to common questions about Study Mode Agent. Can't find what you're looking for? 
            Our support team is here to help.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="space-y-16">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-muted/30 rounded-3xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Still Need Help?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our support team is here to help you succeed. Get in touch with us through any of these channels.
          </p>
          
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Get instant help from our support team</p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Send us a detailed message</p>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Help Center</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Browse our comprehensive guides</p>
                <Button variant="outline" size="sm">
                  Visit Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of students who are already experiencing the future of education.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
