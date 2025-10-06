"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { StudyLoader } from "@/components/ui/study-loader"
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap,
  BarChart3,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  Play,
  Plus,
  Settings,
  User,
  LogOut,
  Loader2
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [studyStats, setStudyStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [showQuizDetails, setShowQuizDetails] = useState(false)

  // Load study stats from API
  const loadStudyStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try multiple endpoints to get comprehensive stats
      const [studyStats, userStats, quizHistory, studySessions] = await Promise.allSettled([
        apiClient.getStudyStats(),
        fetch('/api/v1/professional/user/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()),
        apiClient.getQuizHistory(10),
        apiClient.getStudySessions({ limit: 10 })
      ])
      
      // Combine data from different sources
      const stats = {
        total_sessions: studyStats.status === 'fulfilled' ? studyStats.value.total_sessions : 0,
        total_study_time: studyStats.status === 'fulfilled' ? studyStats.value.total_study_time : 0,
        total_quizzes: quizHistory.status === 'fulfilled' ? (quizHistory.value?.total_quizzes || 0) : (studyStats.status === 'fulfilled' ? studyStats.value.total_quizzes : 0),
        average_score: quizHistory.status === 'fulfilled' ? Math.round(quizHistory.value?.average_score || 0) : (studyStats.status === 'fulfilled' ? Math.round(studyStats.value.average_score || 0) : 0),
        topics_studied: studyStats.status === 'fulfilled' ? (Array.isArray(studyStats.value.topics_studied) ? studyStats.value.topics_studied : []) : [],
        recent_quizzes: quizHistory.status === 'fulfilled' ? (Array.isArray(quizHistory.value?.quizzes) ? quizHistory.value.quizzes : []) : [],
        recent_sessions: studySessions.status === 'fulfilled' ? (Array.isArray(studySessions.value) ? studySessions.value : []) : [],
        progress_records: studyStats.status === 'fulfilled' ? (Array.isArray(studyStats.value.progress_records) ? studyStats.value.progress_records : []) : [],
        // Additional stats from user stats endpoint
        current_streak: userStats.status === 'fulfilled' ? (userStats.value as any)?.current_streak || 0 : 0,
        longest_streak: userStats.status === 'fulfilled' ? (userStats.value as any)?.longest_streak || 0 : 0,
        achievements_count: userStats.status === 'fulfilled' ? (userStats.value as any)?.achievements_count || 0 : 0,
        favorite_subjects: userStats.status === 'fulfilled' ? (userStats.value as any)?.favorite_subjects || [] : []
      }
      
      setStudyStats(stats)
    } catch (err) {
      console.error('Failed to load study stats:', err)
      setError('Failed to load study statistics')
      // Set fallback data
      setStudyStats({
        total_sessions: 0,
        total_study_time: 0,
        total_quizzes: 0,
        average_score: 0,
        topics_studied: [],
        recent_quizzes: [],
        recent_sessions: [],
        progress_records: [],
        current_streak: 0,
        longest_streak: 0,
        achievements_count: 0,
        favorite_subjects: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle quiz details popup
  // Format time taken for display
  const formatTimeTaken = (timeTaken: any) => {
    if (!timeTaken && timeTaken !== 0) return 'N/A'
    
    const time = parseInt(timeTaken)
    if (isNaN(time) || time < 0) return 'N/A'
    
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  // Helper function to get answer text from options
  const getAnswerText = (questionData: any, answerLetter: string | undefined) => {
    if (!questionData || !answerLetter) return 'N/A'
    
    if (questionData.options && Array.isArray(questionData.options)) {
      try {
        const index = answerLetter.charCodeAt(0) - 65 // Convert A=0, B=1, C=2, D=3
        if (index >= 0 && index < questionData.options.length) {
          return questionData.options[index] || answerLetter
        }
        return answerLetter
      } catch {
        return answerLetter
      }
    }
    
    return answerLetter
  }

  const handleQuizClick = (quiz: any) => {
    setSelectedQuiz(quiz)
    setShowQuizDetails(true)
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Load study stats when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadStudyStats()
    }
  }, [isAuthenticated])

  // Show loading state
  if (isLoading || loading) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Loading your study dashboard..."
        />
      </main>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {user?.full_name || user?.username || "User"}!</h1>
            <p className="mt-2 text-muted-foreground">Track your learning progress and continue your journey</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button> */}
            <Button variant="outline" size="sm" onClick={logout} className="flex-1 sm:flex-none bg-red-100 hover:bg-red-200">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats?.current_streak || 0}</div>
            <p className="text-xs text-muted-foreground">Current streak (days)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studyStats?.total_study_time ? 
                `${Math.floor(studyStats.total_study_time / 60)}h ${studyStats.total_study_time % 60}m` : 
                '0h 0m'
              }
            </div>
            <p className="text-xs text-muted-foreground">Total time studied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(studyStats?.average_score || 0)}%</div>
            <p className="text-xs text-muted-foreground">Quiz performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats?.total_quizzes || 0}</div>
            <p className="text-xs text-muted-foreground">Quizzes completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Studied</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStats?.topics_studied?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Subjects covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="study" className="text-xs sm:text-sm">Study</TabsTrigger>
          <TabsTrigger value="quizzes" className="text-xs sm:text-sm">Quizzes</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Array.isArray(studyStats?.recent_sessions) ? studyStats.recent_sessions.slice(0, 3) : []).map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.topic}</p>
                        <p className="text-sm text-muted-foreground">{session.mode} • {session.duration_minutes || 0}min</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{session.mode}</p>
                      <p className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent sessions found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/study-modes">
                    <Play className="h-4 w-4 mr-2" />
                    Start New Study Session
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href=" /chat?mode=assistant">
                    <Brain className="h-4 w-4 mr-2" />
                    Ask AI Assistant
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/quiz-setup">
                    <Target className="h-4 w-4 mr-2" />
                    Take Practice Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(Array.isArray(studyStats?.progress_records) ? studyStats.progress_records : []).length > 0 ? (
                  (Array.isArray(studyStats?.progress_records) ? studyStats.progress_records : []).slice(0, 5).map((record: any, index: number) => (
                    <div key={index} className="space-y-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="font-medium">{record.topic || 'Unknown Topic'}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">{Math.round((record.proficiency_level || 0) * 100)}%</span>
                      </div>
                      <Progress value={(record.proficiency_level || 0) * 100} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{record.total_study_time || 0}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{record.total_quizzes || 0} quizzes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{Math.round(record.average_score || 0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">No progress records found</p>
                    <p className="text-sm">Start studying to track your progress!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Sessions Tab */}
        <TabsContent value="study" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Study Sessions</h3>
            <Button asChild>
              <Link href="/study-modes">
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {(Array.isArray(studyStats?.recent_sessions) ? studyStats.recent_sessions : []).map((session: any) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.mode} • {session.duration_minutes || 0} minutes • {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{session.mode}</div>
                      <Badge variant="secondary">{session.mode}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No study sessions found. Start your first session!
              </div>
            )}
          </div>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quiz Results</h3>
            <Button asChild>
              <Link href="/quiz-setup">
                <Plus className="h-4 w-4 mr-2" />
                Take Quiz
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {(Array.isArray(studyStats?.recent_quizzes) ? studyStats.recent_quizzes : [])?.map((quiz: any) => (
              <Card 
                key={quiz.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleQuizClick(quiz)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{quiz.topic || 'General Quiz'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quiz.difficulty} • {quiz.total_questions || 0} questions • {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Click for details</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{quiz.correct_answers || 0}/{quiz.total_questions || 0}</div>
                      <div className="text-sm text-muted-foreground">{Math.round(quiz.score || 0)}%</div>
                      <Badge variant={quiz.difficulty === 'easy' ? 'default' : quiz.difficulty === 'medium' ? 'secondary' : 'destructive'} className="mt-1">
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No quiz attempts found. Take your first quiz!
              </div>
            )}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <h3 className="text-lg font-semibold">Learning Analytics & Progress</h3>
          
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Study Time Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Study Time</span>
                    <span className="text-sm font-semibold">
                      {studyStats?.total_study_time ? 
                        `${Math.floor(studyStats.total_study_time / 60)}h ${Math.floor(studyStats.total_study_time % 60)}m` : 
                        '0h 0m'
                      }
                    </span>
                  </div>
                  <Progress value={Math.min((studyStats?.total_study_time || 0) / 10, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Progress towards 10 hours goal</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Study Sessions</span>
                    <span className="text-sm font-semibold">{studyStats?.total_sessions || 0}</span>
                  </div>
                  <Progress value={Math.min((studyStats?.total_sessions || 0) / 5, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Progress towards 5 sessions goal</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Streak</span>
                    <span className="text-sm font-semibold">{studyStats?.current_streak || 0} days</span>
                  </div>
                  <Progress value={Math.min((studyStats?.current_streak || 0) / 7, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Progress towards 7-day streak</p>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Performance Analytics */}
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quiz Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Score</span>
                    <span className="text-sm font-semibold">{Math.round(studyStats?.average_score || 0)}%</span>
                  </div>
                  <Progress value={studyStats?.average_score || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground">Overall quiz performance</p>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Quizzes</span>
                    <span className="text-sm font-semibold">{studyStats?.total_quizzes || 0}</span>
                  </div>
                  <Progress value={Math.min((studyStats?.total_quizzes || 0) / 10, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Progress towards 10 quizzes goal</p>
                    </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Topics Covered</span>
                    <span className="text-sm font-semibold">{studyStats?.topics_studied?.length || 0}</span>
                  </div>
                  <Progress value={Math.min((studyStats?.topics_studied?.length || 0) / 5, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">Progress towards 5 topics goal</p>
                </div>
              </CardContent>
            </Card>
                  </div>
                  
          {/* Subject Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Subject Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(Array.isArray(studyStats?.progress_records) ? studyStats.progress_records : []).length > 0 ? (
                <div className="space-y-4">
                  {(Array.isArray(studyStats?.progress_records) ? studyStats.progress_records.slice(0, 5) : []).map((record: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{record.topic || 'Unknown Topic'}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((record.proficiency_level || 0) * 100)}%
                        </span>
                      </div>
                      <Progress value={(record.proficiency_level || 0) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{record.total_study_time || 0}m study time</span>
                        <span>{record.total_quizzes || 0} quizzes • {Math.round(record.average_score || 0)}% avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No subject performance data</p>
                  <p className="text-sm">Complete quizzes and study sessions to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Progress Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Progress Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(Array.isArray(studyStats?.progress_records) ? studyStats.progress_records.slice(0, 6) : []).map((record: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">{record.topic || 'Unknown Topic'}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Proficiency</span>
                            <span>{Math.round((record.proficiency_level || 0) * 100)}%</span>
                          </div>
                          <Progress value={(record.proficiency_level || 0) * 100} className="h-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Study Time</p>
                            <p className="font-semibold">{record.total_study_time || 0}m</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quizzes</p>
                      <p className="font-semibold">{record.total_quizzes || 0}</p>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No progress records found. Start studying to track your progress!
              </div>
            )}
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quiz Details Modal */}
      {showQuizDetails && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-primary" />
                Quiz Results
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowQuizDetails(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Quiz Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-primary">{selectedQuiz.topic || 'General Quiz'}</h2>
                <div className="flex items-center justify-center gap-4">
                  <Badge variant={selectedQuiz.difficulty === 'easy' ? 'default' : selectedQuiz.difficulty === 'medium' ? 'secondary' : 'destructive'} className="text-sm">
                    {selectedQuiz.difficulty?.charAt(0).toUpperCase() + selectedQuiz.difficulty?.slice(1) || 'Medium'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedQuiz.created_at).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{selectedQuiz.correct_answers || 0}/{selectedQuiz.total_questions || 0}</div>
                  <p className="text-sm text-green-700 font-medium">Correct Answers</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{Math.round(selectedQuiz.score || 0)}%</div>
                  <p className="text-sm text-blue-700 font-medium">Score</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatTimeTaken(selectedQuiz.time_taken)}
                  </div>
                  <p className="text-sm text-purple-700 font-medium">Time Taken</p>
                </div>
              </div>

              {/* Quiz Summary */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Quiz Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Questions Answered:</span>
                    <span className="font-semibold">{selectedQuiz.total_questions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Correct Answers:</span>
                    <span className="font-semibold text-green-600">{selectedQuiz.correct_answers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Incorrect Answers:</span>
                    <span className="font-semibold text-red-600">{(selectedQuiz.total_questions || 0) - (selectedQuiz.correct_answers || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Accuracy Rate:</span>
                    <span className="font-semibold">{Math.round(selectedQuiz.score || 0)}%</span>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Performance Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accuracy Rate</span>
                      <span className="text-sm font-semibold">{Math.round(selectedQuiz.score || 0)}%</span>
                    </div>
                    <Progress value={selectedQuiz.score || 0} className="h-2" />
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Questions Completed</span>
                      <span className="text-sm font-semibold">{selectedQuiz.total_questions || 0}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
                
                {/* Performance Level */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="text-sm text-muted-foreground mb-1">Performance Level</div>
                  <div className="text-xl text-muted-foreground  font-bold">
                    {selectedQuiz.score >= 90 ? '🏆 Expert' : 
                     selectedQuiz.score >= 80 ? '🥇 Advanced' : 
                     selectedQuiz.score >= 70 ? '🥈 Intermediate' : 
                     selectedQuiz.score >= 60 ? '🥉 Beginner' : '💪 Keep Learning!'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedQuiz.score >= 90 ? 'Outstanding performance!' : 
                     selectedQuiz.score >= 80 ? 'Great job! You\'re doing well!' : 
                     selectedQuiz.score >= 70 ? 'Good progress! Keep it up!' : 
                     selectedQuiz.score >= 60 ? 'Not bad! Practice more to improve!' : 'Don\'t give up! Every expert was once a beginner!'}
                  </div>
                </div>
              </div>


              {/* Question Review */}
              {selectedQuiz.questions_data && Object.keys(selectedQuiz.questions_data).length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Question Review
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                    {Object.entries(selectedQuiz.questions_data).map(([questionId, questionData]: [string, any]) => (
                      <div key={questionId} className="p-4 bg-muted/30 rounded-lg border">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              questionData.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              <span className="text-xs font-semibold">{questionId.replace('q', '')}</span>
                            </div>
                            <span className="text-sm font-medium">Question {questionId.replace('q', '')}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            questionData.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {questionData.is_correct ? '✓ Correct' : '✗ Incorrect'}
                          </div>
                        </div>
                        
                        {/* Question Text */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900">
                            {questionData.question || 'Question not available'}
                          </p>
                        </div>
                        
                        {/* Options */}
                        <div className="space-y-2 mb-3">
                          {questionData.options && questionData.options.length > 0 ? questionData.options.map((option: string, index: number) => {
                            const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
                            const isCorrect = optionLetter === questionData.correct_answer
                            const isUserAnswer = optionLetter === questionData.user_answer
                            
                            return (
                              <div key={index} className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                                isCorrect ? 'bg-green-50 border border-green-200' : 
                                isUserAnswer && !isCorrect ? 'bg-red-50 border border-red-200' : 
                                'bg-gray-50 border border-gray-200'
                              }`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  isCorrect ? 'bg-green-500 text-white' : 
                                  isUserAnswer && !isCorrect ? 'bg-red-500 text-white' : 
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {optionLetter}
                                </span>
                                <span className="flex-1">{option}</span>
                                {isCorrect && <span className="text-green-600 text-xs font-medium">✓ Correct</span>}
                                {isUserAnswer && !isCorrect && <span className="text-red-600 text-xs font-medium">✗ Your Answer</span>}
                              </div>
                            )
                          }) : (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              Options not available
                            </div>
                          )}
                        </div>
                        
                        {/* Answer Summary */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                              <span className="font-medium">Your Answer:</span> {getAnswerText(questionData, questionData.user_answer)}
                            </span>
                            <span className="text-gray-600">
                              <span className="font-medium">Correct Answer:</span> {getAnswerText(questionData, questionData.correct_answer)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Explanation */}
                        {questionData.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Explanation:</span> {questionData.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Answer Details
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                    {selectedQuiz.answers && typeof selectedQuiz.answers === 'object' ? Object.entries(selectedQuiz.answers).map(([questionId, answer]) => {
                      // Try to get question data for better display
                      const questionData = selectedQuiz.questions_data?.[questionId]
                      const answerText = questionData ? getAnswerText(questionData, answer as string) : (answer as string)
                      
                      return (
                        <div key={questionId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">{questionId.replace('q', '')}</span>
                            </div>
                            <span className="text-sm font-medium">Question {questionId.replace('q', '')}</span>
                          </div>
                          <Badge variant="outline" className="font-medium">{answerText}</Badge>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No detailed question data available for this quiz.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {selectedQuiz.feedback && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Detailed Feedback
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                    {selectedQuiz.feedback && typeof selectedQuiz.feedback === 'object' ? Object.entries(selectedQuiz.feedback).map(([questionId, feedback]) => {
                      // Get question data if available
                      let questionData = selectedQuiz.questions_data?.[questionId]
                      
                      // If no question data available, create a fallback
                      if (!questionData && selectedQuiz.answers && selectedQuiz.answers[questionId]) {
                        // Create basic question data from available information
                        const userAnswer = selectedQuiz.answers[questionId]
                        const isCorrect = selectedQuiz.correct_answers > 0 && selectedQuiz.score > 0
                        questionData = {
                          question: `Question ${questionId.replace('q', '')}`,
                          options: ["Option A", "Option B", "Option C", "Option D"],
                          correct_answer: "A", // Default fallback
                          user_answer: userAnswer,
                          is_correct: isCorrect
                        }
                      }
                      
                      return (
                        <div key={questionId} className="p-4 bg-muted/30 rounded-lg border">
                          <div className="space-y-3">
                            {/* Question Header */}
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                questionData?.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                              }`}>
                                <span className="text-xs font-semibold">{questionId.replace('q', '')}</span>
                              </div>
                              <span className="text-sm font-medium">Question {questionId.replace('q', '')}</span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                questionData?.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {questionData?.is_correct ? '✓ Correct' : '✗ Incorrect'}
                              </div>
                            </div>
                            
                            {/* Question Text */}
                            {questionData?.question && (
                              <div className="p-3 bg-white rounded-md border">
                                <p className="text-sm font-medium text-gray-900">
                                  {questionData.question || 'Question not available'}
                                </p>
                              </div>
                            )}
                            
                            {/* Answer Details */}
                            {questionData && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                                  <span className="text-sm font-semibold text-green-600">
                                    {getAnswerText(questionData, questionData?.correct_answer)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                                  <span className={`text-sm font-semibold ${
                                    questionData.is_correct ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {getAnswerText(questionData, questionData?.user_answer)}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Feedback Message */}
                            <div className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                              <p className="text-sm text-blue-800">
                                {questionData?.is_correct 
                                  ? `✅ Correct! You selected "${getAnswerText(questionData, questionData?.user_answer)}" which is the right answer.`
                                  : `❌ Incorrect. You selected "${getAnswerText(questionData, questionData?.user_answer)}" but the correct answer is "${getAnswerText(questionData, questionData?.correct_answer)}". Review this topic to improve your understanding.`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }) : null}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}


