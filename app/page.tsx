import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      <section className="mx-auto max-w-3xl text-center pt-12 md:pt-16">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Study smarter with your AI Study Agent
        </h1>
        <p className="mt-4 text-muted-foreground">
          Chat, practice, and prepare with focused modes designed to help you learn faster.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/chat">Open Chat</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/study-modes">Explore Study Modes</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">Who is your Study Agent?</h2>
          <p className="mt-3 text-muted-foreground">
            Your AI‑powered study companion. Never forget key concepts, practice with focused modes, and retain more
            with spaced repetition.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button asChild>
              <a href="/signup">Activate free trial</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/pricing">See Pricing</a>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src="/images/hero-owl.png"
            alt="Mascot illustration"
            className="mx-auto w-full max-w-xl rounded-2xl border shadow-sm"
          />
        </div>
      </section>

      <section className="mt-14">
        <h3 className="text-xl font-semibold tracking-tight text-center">What learners say</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { name: "Ava M.", quote: "Raised my exam score by 14% in two weeks.", course: "Calculus I" },
            { name: "Leo R.", quote: "Practice Mode’s hints are insanely helpful.", course: "Organic Chemistry" },
            { name: "Noah K.", quote: "Exam Mode feels like the real test.", course: "AP Physics" },
          ].map((t) => (
            <Card key={t.name} className="bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader>
                <CardTitle className="text-base">{t.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{t.quote}</p>
                <p className="text-xs text-muted-foreground">{t.course}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h3 className="text-xl font-semibold tracking-tight text-center">Study Mode highlights</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { title: "Beginner Mode", desc: "Simple explanations and examples." },
            { title: "Practice Mode", desc: "Targeted problems with hints." },
            { title: "Exam Mode", desc: "Timed tests with instant review." },
          ].map((f) => (
            <Card key={f.title} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
