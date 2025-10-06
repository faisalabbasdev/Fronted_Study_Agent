"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  Brain, 
  Lightbulb, 
  GraduationCap, 
  PenTool,
  Target,
  Zap,
  Star,
  Sparkles
} from "lucide-react"

interface StudyLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "minimal" | "detailed"
  className?: string
  text?: string
}

export function StudyLoader({ 
  size = "md", 
  variant = "default", 
  className,
  text = "Loading your study experience..."
}: StudyLoaderProps) {
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6", 
    xl: "w-8 h-8"
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative">
          {/* Main spinning circle */}
          <div className={cn(
            "border-2 border-primary/20 border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )} />
          
          {/* Inner study icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className={cn("text-primary animate-pulse", iconSizes[size])} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        {/* Main loader container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className={cn(
            "border-2 border-primary/10 border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )} />
          
          {/* Middle ring */}
          <div className={cn(
            "absolute inset-2 border border-accent/20 border-r-accent rounded-full animate-spin",
            "animation-delay-150"
          )} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          
          {/* Inner ring */}
          <div className={cn(
            "absolute inset-4 border border-chart-2/20 border-b-chart-2 rounded-full animate-spin",
            "animation-delay-300"
          )} style={{ animationDuration: '2s' }} />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className={cn("text-primary animate-bounce", iconSizes[size])} />
          </div>
        </div>
        
        {/* Floating study elements */}
        <div className="relative w-32 h-8">
          <BookOpen className="absolute top-0 left-0 w-4 h-4 text-chart-1 animate-float" style={{ animationDelay: '0s' }} />
          <Lightbulb className="absolute top-0 right-0 w-4 h-4 text-chart-2 animate-float" style={{ animationDelay: '0.5s' }} />
          <PenTool className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-chart-3 animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        </div>
      </div>
    )
  }

  // Default variant - Reddit-style with study theme
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-6", className)}>
      {/* Main loader */}
      <div className="relative">
        {/* Background circle */}
        <div className={cn(
          "bg-gradient-to-r from-primary/10 via-accent/10 to-chart-1/10 rounded-full",
          "animate-pulse",
          sizeClasses[size]
        )} />
        
        {/* Rotating elements */}
        <div className="absolute inset-0 animate-spin">
          <div className="relative w-full h-full">
            {/* Study icons rotating around */}
            <BookOpen className={cn(
              "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "text-primary animate-pulse",
              iconSizes[size]
            )} />
            <Brain className={cn(
              "absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2",
              "text-chart-2 animate-pulse",
              iconSizes[size]
            )} />
            <Lightbulb className={cn(
              "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2",
              "text-chart-1 animate-pulse", 
              iconSizes[size]
            )} />
            <Target className={cn(
              "absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "text-accent animate-pulse",
              iconSizes[size]
            )} />
          </div>
        </div>
        
        {/* Center pulsing icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <GraduationCap className={cn("text-primary animate-bounce", iconSizes[size])} />
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          </div>
        </div>
      </div>
      
      {/* Loading text with typing effect */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-lg font-semibold text-foreground">Study Mode</span>
          <Sparkles className="w-4 h-4 text-primary animate-spin" />
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-sm text-muted-foreground">{text}</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Full page loader component
export function FullPageStudyLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text={text || "Preparing your learning environment..."}
        />
        
        {/* Additional loading elements */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-chart-2 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          
          <div className="text-xs text-muted-foreground animate-pulse">
            Loading study materials and AI assistant...
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline loader for components
export function InlineStudyLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <StudyLoader size="md" variant="minimal" />
    </div>
  )
}

// Button loader for form submissions
export function ButtonStudyLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center space-x-2">
      <StudyLoader size={size} variant="minimal" />
      <span className="text-sm text-muted-foreground">Processing...</span>
    </div>
  )
}
