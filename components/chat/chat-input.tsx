"use client"

import * as React from "react"
import { Mic, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void
}) {
  const [text, setText] = React.useState("")
  const fileRef = React.useRef<HTMLInputElement>(null)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText("")
  }

  return (
    <div className="pointer-events-auto">
      <form onSubmit={submit} className="mx-auto max-w-3xl px-4 pb-6" aria-label="Chat input">
        <div className="flex items-center gap-2 rounded-2xl border bg-card/80 p-2 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <Button type="button" variant="ghost" size="icon" aria-label="Start voice input" className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask me anything about your study…"
            className="border-0 focus-visible:ring-0 bg-transparent"
            aria-label="Message"
          />
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={() => {
              // Placeholder: file handling hook point
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload a file"
            className="rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="submit" className="rounded-full">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
