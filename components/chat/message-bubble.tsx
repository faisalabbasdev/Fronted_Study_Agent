"use client"

import type React from "react"

import { cn } from "@/lib/utils"

export function MessageBubble({
  role,
  children,
}: {
  role: "user" | "ai"
  children: React.ReactNode
}) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors",
          isUser
            ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
            : "bg-card text-card-foreground ring-1 ring-primary/30",
        )}
        style={
          !isUser
            ? {
                boxShadow:
                  "0 0 0 1px color-mix(in oklab, var(--color-primary) 35%, transparent), 0 0 16px color-mix(in oklab, var(--color-primary) 15%, transparent)",
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
