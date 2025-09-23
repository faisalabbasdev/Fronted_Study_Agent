"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, User, Mail, Lock, Chrome } from "lucide-react"
import * as React from "react"
import { Progress } from "@/components/ui/progress"

export default function SignupPage() {
  const [show1, setShow1] = React.useState(false)
  const [show2, setShow2] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const strength = (() => {
    let s = 0
    if (password.length >= 8) s += 30
    if (/[A-Z]/.test(password)) s += 20
    if (/[0-9]/.test(password)) s += 20
    if (/[^A-Za-z0-9]/.test(password)) s += 30
    return Math.min(s, 100)
  })()

  return (
    <main className="mx-auto max-w-6xl grid grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <Card className="w-full bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent">
              <Chrome className="mr-2 h-4 w-4" /> Continue with Google
            </Button>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Jane Doe" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={show1 ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={show1 ? "Hide password" : "Show password"}
                  onClick={() => setShow1((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                >
                  {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Progress value={strength} className="h-1" />
              <ul className="grid gap-1 text-xs text-muted-foreground">
                <li>• At least 8 characters</li>
                <li>• Contains a number and a capital letter</li>
                <li>• Includes a symbol</li>
              </ul>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="confirm" type={show2 ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" />
                <button
                  type="button"
                  aria-label={show2 ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShow2((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                >
                  {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full transition-shadow hover:shadow-[0_0_24px_0_color-mix(in_oklab,_var(--color-primary)_30%,_transparent)]">
              Sign up
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border">
          {/* AI-themed illustration placeholder */}
          <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_20%_20%,_color-mix(in_oklab,_var(--color-primary)_20%,_transparent)_0%,_transparent_70%),radial-gradient(40%_30%_at_80%_30%,_color-mix(in_oklab,_var(--color-accent)_18%,_transparent)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-xl border px-4 py-2 text-sm text-muted-foreground backdrop-blur">
              Futuristic AI interface illustration
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
