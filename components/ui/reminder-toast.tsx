"use client"

import { useState, useEffect } from "react"
import { X, BookOpen, TrendingUp, AlertCircle } from "lucide-react"

interface ReminderToastProps {
  message: string
  subject: string
  averageScore?: number | null
  hasQuizData: boolean
  onClose?: () => void
  duration?: number
}

export function ReminderToast({ 
  message, 
  subject, 
  averageScore, 
  hasQuizData, 
  onClose, 
  duration = 6000 
}: ReminderToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const getIcon = () => {
    if (!hasQuizData) {
      return <BookOpen className="h-5 w-5" />
    }
    
    if (averageScore === null || averageScore === undefined || averageScore >= 70) {
      return <TrendingUp className="h-5 w-5" />
    }
    
    return <AlertCircle className="h-5 w-5" />
  }

  const getToastStyles = () => {
    if (!hasQuizData) {
      return 'bg-blue-500 text-white border-blue-600'
    }
    
    if (averageScore === null || averageScore === undefined || averageScore >= 70) {
      return 'bg-green-500 text-white border-green-600'
    }
    
    return 'bg-orange-500 text-white border-orange-600'
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg transition-all duration-300 ${
        isAnimating ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${getToastStyles()}`}
    >
      <div className="flex items-start gap-3 max-w-sm">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm mb-1">
            Study Reminder
          </div>
          <p className="text-sm leading-relaxed">
            {message}
          </p>
          {hasQuizData && averageScore !== null && (
            <div className="text-xs mt-2 opacity-90">
              {subject} • {averageScore}% average
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity ml-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook for managing reminder toasts
export function useReminderToast() {
  const [reminderToast, setReminderToast] = useState<{
    message: string
    subject: string
    averageScore?: number | null
    hasQuizData: boolean
  } | null>(null)

  const showReminderToast = (data: {
    message: string
    subject: string
    averageScore?: number | null
    hasQuizData: boolean
  }) => {
    setReminderToast(data)
  }

  const hideReminderToast = () => {
    setReminderToast(null)
  }

  const ReminderToastContainer = () => {
    if (!reminderToast) return null

    return (
      <ReminderToast
        message={reminderToast.message}
        subject={reminderToast.subject}
        averageScore={reminderToast.averageScore}
        hasQuizData={reminderToast.hasQuizData}
        onClose={hideReminderToast}
        duration={6000}
      />
    )
  }

  return { showReminderToast, hideReminderToast, ReminderToastContainer }
}
