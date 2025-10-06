"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Star, 
  Target, 
  CheckCircle, 
  Clock, 
  Award,
  Brain,
  Zap,
  Trophy,
  PlayCircle,
  HelpCircle,
  Sparkles
} from "lucide-react"
import { EnhancedMessageContent } from "./enhanced-message-content"

// Mode-specific theme configurations using project's color scheme
export const modeThemes = {
  beginner: {
    icon: Heart,
    modeName: "Beginner Mode",
    description: "Learn concepts with simple language and examples",
    emoji: "🌱",
    // Using project's color scheme with subtle variations
    headerBg: "bg-card/50 border-b border-border",
    accentBg: "bg-accent/20",
    accentBorder: "border-accent/30",
    accentText: "text-accent-foreground",
    iconBg: "bg-accent",
    iconColor: "text-accent-foreground",
    bubbleStyle: "bg-card/80 border border-border/50",
    userBubbleStyle: "bg-primary/10 border border-primary/20",
    quickActionStyle: "bg-secondary/50 border border-border hover:bg-accent/20"
  },
  practice: {
    icon: Target,
    modeName: "Practice Mode", 
    description: "Interactive exercises with hints and step-by-step solutions",
    emoji: "🎯",
    // Using chart colors for practice mode
    headerBg: "bg-card/50 border-b border-border",
    accentBg: "bg-chart-2/20",
    accentBorder: "border-chart-2/30",
    accentText: "text-chart-2",
    iconBg: "bg-chart-2",
    iconColor: "text-white",
    bubbleStyle: "bg-card/80 border border-border/50",
    userBubbleStyle: "bg-primary/10 border border-primary/20",
    quickActionStyle: "bg-secondary/50 border border-border hover:bg-chart-2/20"
  },
  exam: {
    icon: Award,
    modeName: "Exam Mode",
    description: "Timed assessments with results and comprehensive review",
    emoji: "📝",
    // Using chart colors for exam mode
    headerBg: "bg-card/50 border-b border-border",
    accentBg: "bg-chart-1/20",
    accentBorder: "border-chart-1/30", 
    accentText: "text-chart-1",
    iconBg: "bg-chart-1",
    iconColor: "text-white",
    bubbleStyle: "bg-card/80 border border-border/50",
    userBubbleStyle: "bg-primary/10 border border-primary/20",
    quickActionStyle: "bg-secondary/50 border border-border hover:bg-chart-1/20"
  },
  assistant: {
    icon: Brain,
    modeName: "AI Assistant",
    description: "Your intelligent study companion for all subjects",
    emoji: "🤖",
    // Professional AI assistant theme
    headerBg: "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-indigo-200/30",
    accentBg: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20",
    accentBorder: "border-indigo-300/40",
    accentText: "text-indigo-600",
    iconBg: "bg-gradient-to-r from-indigo-500 to-purple-500",
    iconColor: "text-white",
    bubbleStyle: "bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200/50",
    userBubbleStyle: "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border border-blue-200/50",
    quickActionStyle: "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:from-indigo-100 hover:to-purple-100"
  }
}

// Mode-specific header component
export function ModeHeader({ mode }: { mode: string }) {
  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner
  const Icon = theme.icon

  return (
    <div className={cn("relative", theme.headerBg)}>
      <div className="px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", theme.iconBg)}>
              <Icon className={cn("w-5 h-5", theme.iconColor)} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                {theme.emoji} {theme.modeName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {theme.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mode-specific message bubble component
export function ModeMessageBubble({
  role,
  children,
  mode
}: {
  role: "user" | "ai"
  children: React.ReactNode
  mode: string
}) {
  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner
  const isUser = role === "user"
  const Icon = theme.icon

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%]">
        {/* Mode indicator for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 ml-2">
            <Icon className={cn("w-3 h-3", theme.accentText)} />
            <span className={cn("text-xs font-medium", theme.accentText)}>
              {theme.modeName}
            </span>
          </div>
        )}
        
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200",
            isUser 
              ? theme.userBubbleStyle
              : theme.bubbleStyle
          )}
          style={
            !isUser
              ? {
                  boxShadow:
                    "0 0 0 1px color-mix(in oklab, var(--color-primary) 20%, transparent), 0 0 8px color-mix(in oklab, var(--color-primary) 8%, transparent)",
                }
              : undefined
          }
        >
          {!isUser ? (
            <EnhancedMessageContent content={children as string} mode={mode} role={role} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}

// Mode-specific typing indicator
export function ModeTypingIndicator({ mode }: { mode: string }) {
  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner
  const Icon = theme.icon

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", theme.accentText)} />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

// Mode-specific input area
export function ModeInputArea({ mode }: { mode: string }) {
  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner
  const Icon = theme.icon

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", theme.accentText)} />
          <span className="text-sm text-muted-foreground">
            Ask your {mode} question...
          </span>
        </div>
      </div>
    </div>
  )
}

// Mode-specific quick actions
export function ModeQuickActions({ mode, onAction }: { mode: string, onAction: (action: string) => void }) {
  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner

  const quickActions = {
    beginner: [
      { icon: BookOpen, label: "Explain Simply", action: "Can you explain this in simple terms?" },
      { icon: Lightbulb, label: "Give Examples", action: "Can you give me some examples?" },
      { icon: HelpCircle, label: "Ask Questions", action: "What questions should I ask about this topic?" }
    ],
    practice: [
      { icon: Target, label: "Practice Problem", action: "Give me a practice problem to solve" },
      { icon: CheckCircle, label: "Step-by-Step", action: "Show me the step-by-step solution" },
      { icon: PlayCircle, label: "Interactive", action: "Let's do an interactive exercise" }
    ],
    exam: [
      { icon: Clock, label: "Timed Quiz", action: "Create a timed quiz for me" },
      { icon: Brain, label: "Review Key Points", action: "What are the key points to remember?" },
      { icon: Trophy, label: "Assessment", action: "Give me an assessment on this topic" }
    ],
    assistant: [
      { icon: Brain, label: "AI Analysis", action: "Analyze this topic and provide insights" },
      { icon: Zap, label: "Quick Help", action: "I need help understanding this concept" },
      { icon: Star, label: "Study Plan", action: "Create a study plan for this subject" },
      { icon: BookOpen, label: "Resources", action: "What resources should I use to learn this?" }
    ]
  }

  const actions = quickActions[mode as keyof typeof quickActions] || quickActions.beginner

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onAction(action.action)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
              theme.quickActionStyle
            )}
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
