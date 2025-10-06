"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { 
  Lightbulb, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Target,
  Award,
  Heart,
  Star,
  Zap,
  Brain,
  Clock,
  Trophy
} from "lucide-react"

interface EnhancedMessageContentProps {
  content: string
  mode: string
  role: "user" | "ai"
}

export function EnhancedMessageContent({ content, mode, role }: EnhancedMessageContentProps) {
  // Parse content for special formatting
  const parseContent = (text: string) => {
    const parts = []
    let currentIndex = 0
    
    // Look for patterns like **text**, *text*, `code`, etc.
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
      { regex: /\*(.*?)\*/g, type: 'italic' },
      { regex: /`(.*?)`/g, type: 'code' },
      { regex: /^•\s+(.*)$/gm, type: 'bullet' },
      { regex: /^\d+\.\s+(.*)$/gm, type: 'numbered' },
      { regex: /^###\s+(.*)$/gm, type: 'subheading' },
      { regex: /^##\s+(.*)$/gm, type: 'heading' },
      { regex: /^#\s+(.*)$/gm, type: 'mainheading' }
    ]
    
    // For now, let's create a simple parser
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      
      // Handle different line types
      if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.slice(2, -2)
        return (
          <div key={index} className="font-bold text-lg mb-2">
            {getModeIcon(mode)} {text}
          </div>
        )
      }
      
      if (line.startsWith('• ')) {
        const text = line.slice(2)
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-current mt-2 flex-shrink-0"></div>
            <span>{text}</span>
          </div>
        )
      }
      
      if (line.startsWith('✨') || line.startsWith('🎯') || line.startsWith('💪') || 
          line.startsWith('🚀') || line.startsWith('📝') || line.startsWith('🏆') ||
          line.startsWith('⏰') || line.startsWith('🌱')) {
        return (
          <div key={index} className="flex items-center gap-2 mb-2 font-medium">
            <span className="text-lg">{line.charAt(0)}</span>
            <span>{line.slice(1).trim()}</span>
          </div>
        )
      }
      
      if (line.startsWith('### ')) {
        return (
          <div key={index} className="font-semibold text-base mt-3 mb-2">
            {line.slice(4)}
          </div>
        )
      }
      
      if (line.startsWith('## ')) {
        return (
          <div key={index} className="font-bold text-lg mt-4 mb-2">
            {line.slice(3)}
          </div>
        )
      }
      
      if (line.startsWith('# ')) {
        return (
          <div key={index} className="font-bold text-xl mt-4 mb-3">
            {line.slice(2)}
          </div>
        )
      }
      
      // Regular text
      return (
        <div key={index} className="mb-2">
          {parseInlineFormatting(line)}
        </div>
      )
    })
  }
  
  const parseInlineFormatting = (text: string) => {
    const parts = []
    let currentIndex = 0
    
    // Handle bold text
    const boldRegex = /\*\*(.*?)\*\*/g
    let match
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index))
      }
      
      // Add the bold text
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[1]}
        </strong>
      )
      
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex))
    }
    
    return parts.length > 0 ? parts : text
  }
  
  const getModeIcon = (mode: string) => {
    const icons = {
      beginner: Heart,
      practice: Target,
      exam: Award
    }
    const Icon = icons[mode as keyof typeof icons] || Heart
    
    const iconColors = {
      beginner: "text-accent-foreground",
      practice: "text-chart-2", 
      exam: "text-chart-1"
    }
    
    return (
      <Icon className={cn("w-5 h-5 inline mr-2", iconColors[mode as keyof typeof iconColors] || "text-accent-foreground")} />
    )
  }
  
  const getModeStyle = (mode: string) => {
    const styles = {
      beginner: "text-foreground",
      practice: "text-foreground", 
      exam: "text-foreground"
    }
    return styles[mode as keyof typeof styles] || "text-foreground"
  }
  
  return (
    <div className={cn("prose prose-sm max-w-none", getModeStyle(mode))}>
      {parseContent(content)}
    </div>
  )
}

// Special component for interactive elements
export function InteractiveElement({ 
  type, 
  content, 
  mode 
}: { 
  type: 'question' | 'answer' | 'example' | 'hint' | 'exercise'
  content: string
  mode: string 
}) {
  const getElementConfig = () => {
    const configs = {
      question: {
        icon: HelpCircle,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        title: "Question"
      },
      answer: {
        icon: CheckCircle,
        bgColor: "bg-green-50",
        borderColor: "border-green-200", 
        textColor: "text-green-800",
        title: "Answer"
      },
      example: {
        icon: Lightbulb,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800", 
        title: "Example"
      },
      hint: {
        icon: Zap,
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        title: "Hint"
      },
      exercise: {
        icon: Target,
        bgColor: "bg-orange-50", 
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        title: "Exercise"
      }
    }
    return configs[type]
  }
  
  const config = getElementConfig()
  const Icon = config.icon
  
  return (
    <div className={cn(
      "p-4 rounded-lg border-2 mb-3",
      config.bgColor,
      config.borderColor
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", config.textColor)} />
        <span className={cn("font-semibold text-sm", config.textColor)}>
          {config.title}
        </span>
      </div>
      <div className={cn("text-sm", config.textColor)}>
        {content}
      </div>
    </div>
  )
}
