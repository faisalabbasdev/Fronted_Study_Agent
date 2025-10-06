"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { FullPageStudyLoader } from "@/components/ui/study-loader"

interface LoadingContextType {
  isLoading: boolean
  loadingText: string
  setLoading: (loading: boolean, text?: string) => void
  showFullPageLoader: (text?: string) => void
  hideFullPageLoader: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading your study experience...")
  const [showFullPage, setShowFullPage] = useState(false)

  const setLoading = (loading: boolean, text?: string) => {
    setIsLoading(loading)
    if (text) {
      setLoadingText(text)
    }
  }

  const showFullPageLoader = (text?: string) => {
    setLoadingText(text || "Preparing your learning environment...")
    setShowFullPage(true)
    setIsLoading(true)
  }

  const hideFullPageLoader = () => {
    setShowFullPage(false)
    setIsLoading(false)
  }

  // Auto-hide full page loader after 3 seconds (for demo purposes)
  useEffect(() => {
    if (showFullPage) {
      const timer = setTimeout(() => {
        hideFullPageLoader()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showFullPage])

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingText,
      setLoading,
      showFullPageLoader,
      hideFullPageLoader
    }}>
      {children}
      {showFullPage && <FullPageStudyLoader text={loadingText} />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
