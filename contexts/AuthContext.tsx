"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient, tokenManager, User, SignupData, LoginData, AuthResponse } from '@/lib/api'
import toast from 'react-hot-toast'
import { useReminderToast } from '@/components/ui/reminder-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showReminderToast, ReminderToastContainer } = useReminderToast()

  const isAuthenticated = !!user

  // Function to show personalized reminder toast
  const showPersonalizedReminder = async () => {
    try {
      const reminderData = await apiClient.getWeakestSubject()
      showReminderToast({
        message: reminderData.message,
        subject: reminderData.subject,
        averageScore: reminderData.average_score,
        hasQuizData: reminderData.has_quiz_data
      })
    } catch (error) {
      console.error('Failed to load reminder data:', error)
      // Show a generic welcome message if API fails
      showReminderToast({
        message: "Welcome back! Continue your learning journey.",
        subject: "General Studies",
        hasQuizData: false
      })
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken()
      if (token) {
        try {
          const userData = await apiClient.getCurrentUser()
          setUser(userData)
          // Show personalized reminder after successful login
          await showPersonalizedReminder()
        } catch (error) {
          // Token is invalid, remove it
          tokenManager.removeToken()
          console.error('Invalid token:', error)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await apiClient.login(data)
      
      // Store token
      tokenManager.setToken(response.access_token)
      
      // Set user data
      setUser(response.user)
      
      toast.success(`Welcome back, ${response.user.full_name}!`)
      
      // Show personalized reminder toast after successful login
      await showPersonalizedReminder()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await apiClient.signup(data)
      
      // Store token
      tokenManager.setToken(response.access_token)
      
      // Set user data
      setUser(response.user)
      
      toast.success(`Welcome to Tayyar, ${response.user.full_name}!`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    tokenManager.removeToken()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
    } catch (error) {
      // Token is invalid, logout user
      logout()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ReminderToastContainer />
    </AuthContext.Provider>
  )
}
