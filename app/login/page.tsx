"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react"
import * as React from "react"

export default function LoginPage() {
  const [show, setShow] = React.useState(false)
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            <Chrome className="mr-2 h-4 w-4" /> Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full transition-shadow hover:shadow-[0_0_24px_0_color-mix(in_oklab,_var(--color-primary)_30%,_transparent)]">
            Log in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
