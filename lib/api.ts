/**
 * API Client for Study Mode Agent Backend
 * Handles all API communication with proper error handling and token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cozy-comfort-production.up.railway.app'

export interface User {
  id: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  preferences: Record<string, any>
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface SignupData {
  email: string
  username: string
  full_name: string
  password: string
  preferences?: Record<string, any>
}

export interface LoginData {
  username: string
  password: string
}

export interface StudentSubject {
  id: number
  name: string
  university?: string | null
  program?: string | null
  semester?: string | null
  exam_date?: string | null
  days_until_exam?: number | null
  questions_attempted: number
  average_score: number
  practice_mastery: number
  weak_topics: Array<{ topic: string; mastery: number }>
  topic_performance: Array<{ topic: string; mastery: number; questions_attempted: number; weak: boolean }>
  materials: Array<{
    id: number
    title: string
    material_type: string
    page_count: number
    topics: string[]
  }>
}

export interface ApiError {
  detail: string | Array<{ msg?: string }>
  status_code?: number
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status_code: response.status
        }))
        const detail = Array.isArray(errorData.detail)
          ? errorData.detail.map((issue) => issue.msg || "Invalid request").join("; ")
          : errorData.detail
        throw new Error(detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Authentication endpoints
  async signup(data: SignupData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)

    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        // Remove Content-Type for FormData
      },
      body: formData,
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/v1/auth/me')
  }

  async updateCurrentUser(data: { full_name?: string; preferences?: Record<string, any> }): Promise<User> {
    return this.request<User>('/api/v1/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getWeakestSubject(): Promise<{
    subject: string
    average_score: number | null
    attempt_count: number
    session_count: number
    message: string
    has_quiz_data: boolean
    error?: string
  }> {
    return this.request<any>('/api/v1/auth/weakest-subject')
  }

  // Study endpoints
  async getStudyStats(): Promise<any> {
    return this.request<any>('/api/v1/study/stats')
  }

  async getStudySessions(params?: { skip?: number; limit?: number; topic?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.topic) searchParams.append('topic', params.topic)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/v1/study/sessions?${queryString}` : '/api/v1/study/sessions'
    
    return this.request<any[]>(endpoint)
  }

  async createStudySession(data: {
    topic: string
    mode: 'beginner' | 'practice' | 'exam'
    notes?: string
  }): Promise<any> {
    return this.request<any>('/api/v1/study/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateStudySession(sessionId: string, data: {
    end_time?: string
    duration_minutes?: number
    notes?: string
  }): Promise<any> {
    return this.request<any>(`/api/v1/study/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getQuizAttempts(params?: { skip?: number; limit?: number; topic?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.topic) searchParams.append('topic', params.topic)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/v1/study/quizzes?${queryString}` : '/api/v1/study/quizzes'
    
    return this.request<any[]>(endpoint)
  }

  async createQuizAttempt(data: {
    session_id?: number
    topic: string
    difficulty: string
    score: number
    total_questions: number
    correct_answers: number
    answers: Record<string, any>
    feedback: Record<string, any>
  }): Promise<any> {
    return this.request<any>('/api/v1/study/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProgressRecords(params?: { skip?: number; limit?: number; topic?: string }): Promise<any[]> {
    const searchParams = new URLSearchParams()
    if (params?.skip) searchParams.append('skip', params.skip.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.topic) searchParams.append('topic', params.topic)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/v1/study/progress?${queryString}` : '/api/v1/study/progress'
    
    return this.request<any[]>(endpoint)
  }

  async createProgressRecord(data: {
    topic: string
    proficiency_level: number
    total_study_time: number
    total_quizzes: number
    average_score: number
    strengths: string[]
    weaknesses: string[]
    next_review_date?: string
  }): Promise<any> {
    return this.request<any>('/api/v1/study/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Agent endpoints
  async chatWithAgent(data: {
    message: string
    session_id?: string
    context?: Record<string, any>
    mode?: string
  }): Promise<any> {
    return this.request<any>('/api/v1/professional/chat/send', {
      method: 'POST',
      body: JSON.stringify({
        message: data.message,
        context: data.context,
        message_type: 'general',
        subject: 'General',
        priority: 'normal',
        session_id: data.session_id,
        mode: data.mode || 'assistant'
      }),
    })
  }

  async getExplanation(data: {
    message: string
    session_id?: string
    context?: Record<string, any>
  }): Promise<any> {
    return this.request<any>('/api/v1/agents/explain', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }


  async getMotivation(data: {
    message: string
    session_id?: string
    context?: Record<string, any>
  }): Promise<any> {
    return this.request<any>('/api/v1/agents/motivate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProgressAnalysis(data: {
    message: string
    session_id?: string
    context?: Record<string, any>
  }): Promise<any> {
    return this.request<any>('/api/v1/agents/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Quiz endpoints
  async generateQuiz(data: {
    subject: string
    difficulty?: string
    num_questions?: number
    topics?: string[]
    learning_objectives?: string[]
    time_limit?: number
    mode?: 'general' | 'material' | 'topic' | 'weak' | 'mistake' | 'exam' | 'daily'
    subject_id?: number
    material_id?: number
  }): Promise<any> {
    return this.request<any>('/api/v1/professional/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async submitQuiz(data: {
    quiz_id: string
    answers: Array<{
      question_id: string
      selected_answer: string
      is_correct: boolean
    }>
    time_taken: number
    questions_data?: Record<string, any>
    topic?: string
    difficulty?: string
    subject_id?: number
    mode?: string
  }): Promise<any> {
    return this.request<any>('/api/v1/professional/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getQuizHistory(limit?: number): Promise<any> {
    const endpoint = limit ? `/api/v1/professional/quiz/history?limit=${limit}` : '/api/v1/professional/quiz/history'
    return this.request<any>(endpoint)
  }

  async getQuizSubjects(): Promise<any> {
    return this.request<any>('/api/v1/professional/quiz/subjects')
  }

  async getQuizDifficulties(): Promise<any> {
    return this.request<any>('/api/v1/professional/quiz/difficulties')
  }

  async getLearningOverview(): Promise<any> {
    return this.request<any>('/api/v1/learning/overview')
  }

  async getLearningSubjects(): Promise<StudentSubject[]> {
    return this.request<StudentSubject[]>('/api/v1/learning/subjects')
  }

  async createLearningSubject(data: {
    name: string
    university?: string
    program?: string
    semester?: string
    exam_date?: string | null
  }): Promise<StudentSubject> {
    const { exam_date, ...subjectData } = data
    return this.request<StudentSubject>('/api/v1/learning/subjects', {
      method: 'POST',
      body: JSON.stringify({
        ...subjectData,
        ...(exam_date?.trim() ? { exam_date: exam_date.trim() } : {}),
      }),
    })
  }

  async updateLearningSubject(subjectId: number, data: {
    name?: string
    university?: string
    program?: string
    semester?: string
    exam_date?: string | null
  }): Promise<StudentSubject> {
    return this.request<StudentSubject>(`/api/v1/learning/subjects/${subjectId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async uploadStudyMaterial(
    subjectId: number,
    file: File,
    materialType: 'lecture' | 'book' | 'slides' | 'past_paper',
  ): Promise<any> {
    const token = tokenManager.getToken()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('material_type', materialType)
    const response = await fetch(`${this.baseURL}/api/v1/learning/subjects/${subjectId}/materials`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
      throw new Error(errorData.detail || `HTTP ${response.status}`)
    }
    return response.json()
  }

  async openMaterialSource(materialId: number, page?: number): Promise<void> {
    const sourceTab = window.open("about:blank", "_blank")
    if (!sourceTab) {
      throw new Error("Allow pop-ups to view your source PDF")
    }
    const token = tokenManager.getToken()
    try {
      const response = await fetch(`${this.baseURL}/api/v1/learning/materials/${materialId}/source`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }
      const sourceUrl = URL.createObjectURL(await response.blob())
      sourceTab.location.href = page ? `${sourceUrl}#page=${page}` : sourceUrl
      window.setTimeout(() => URL.revokeObjectURL(sourceUrl), 60_000)
    } catch (error) {
      sourceTab.close()
      throw error
    }
  }

  async getDailyRecommendation(subjectId?: number): Promise<any> {
    const query = subjectId ? `?subject_id=${subjectId}` : ''
    return this.request<any>(`/api/v1/learning/recommendations/daily${query}`)
  }

  async analyzePastPaper(materialId: number): Promise<any> {
    return this.request<any>(`/api/v1/learning/materials/${materialId}/analyze`, {
      method: 'POST',
    })
  }

  async getMistakes(subjectId?: number): Promise<any> {
    const query = subjectId ? `?subject_id=${subjectId}` : ''
    return this.request<any>(`/api/v1/learning/mistakes${query}`)
  }

  // Memory endpoints
  async storeConversationMemory(data: {
    user_id: number
    session_id: string
    role: 'USER' | 'ASSISTANT' | 'SYSTEM'
    message: string
    agent_name?: string
    agent_type?: string
    context?: Record<string, any>
    message_metadata?: Record<string, any>
  }): Promise<any> {
    return this.request<any>('/api/v1/api/conversation-memory/store', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getConversationContext(data: {
    user_id: number
    session_id?: string
    limit?: number
    agent_type?: string
  }): Promise<any> {
    return this.request<any>('/api/v1/api/conversation-memory/context', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getConversationHistory(user_id: number, session_id: string): Promise<any> {
    return this.request<any>(`/api/v1/api/conversation-memory/history/${user_id}/${session_id}`)
  }

  async getConversationStats(user_id: number): Promise<any> {
    return this.request<any>(`/api/v1/api/conversation-memory/stats/${user_id}`)
  }

  async getUserSessions(user_id: number, limit: number = 20): Promise<any> {
    return this.request<any>(`/api/v1/api/conversation-memory/sessions/${user_id}?limit=${limit}`)
  }

  async endConversationSession(session_id: string, user_id: number): Promise<any> {
    return this.request<any>(`/api/v1/api/conversation-memory/session/${session_id}?user_id=${user_id}`, {
      method: 'DELETE',
    })
  }

}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Utility functions for token management
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },
  
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken()
  }
}
