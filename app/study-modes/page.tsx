import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, Timer, Target } from "lucide-react"

const modes = [
  {
    slug: "beginner",
    title: "Beginner Mode",
    desc: "Learn concepts with simple language and examples.",
  },
  {
    slug: "practice",
    title: "Practice Mode",
    desc: "Interactive exercises with hints and step-by-step solutions.",
  },
  {
    slug: "exam",
    title: "Exam Mode",
    desc: "Timed assessments with results and review.",
  },
]

export default function StudyModesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Study Modes</h1>
      <p className="mt-2 text-muted-foreground">Choose a mode to tailor your learning experience.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {modes.map((m) => (
          <Card key={m.slug} className="group overflow-hidden border transition duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/chat?mode=${m.slug}`}>Start</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Feature Highlights Row */}
      <section className="mt-12 grid gap-6 md:grid-cols-4">
        {[
          { icon: BookOpen, title: "Concept Cards", desc: "Summaries with key formulas and tips." },
          { icon: Brain, title: "Adaptive Hints", desc: "Scaffolded hints that meet your level." },
          { icon: Target, title: "Weak-spot Drills", desc: "Focus practice where you need it." },
          { icon: Timer, title: "Exam Timing", desc: "Simulate real testing conditions." },
        ].map((f) => (
          <Card key={f.title} className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="flex-row items-center gap-3">
              <f.icon className="h-5 w-5 text-primary" aria-hidden />
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
