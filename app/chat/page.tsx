"use client"

import * as React from "react"
import { MessageBubble } from "@/components/chat/message-bubble"
import ChatInput from "@/components/chat/chat-input"

type Msg = { id: string; role: "user" | "ai"; content: string }

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Msg[]>([
    { id: "1", role: "ai", content: "Hi! I’m your Study Agent. How can I help you learn today?" },
  ])
  const [typing, setTyping] = React.useState(false)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  const onSend = async (text: string) => {
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((m) => [...m, user])
    setTyping(true)
    // Simulate AI response
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content:
            "Here’s a plan: break the topic into 3 key ideas, practice with spaced recall, and test yourself with quick quizzes.",
        },
      ])
      setTyping(false)
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" })
    }, 900)
  }

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [])

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      <div ref={scrollerRef} className="mx-auto mt-6 w-full max-w-3xl flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role}>
              {m.content}
            </MessageBubble>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="ai-typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 inset-x-0">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  )
}
