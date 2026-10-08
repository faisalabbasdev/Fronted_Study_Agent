"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  Brain,
  Loader2,
  Play,
  Star,
  Heart,
  Zap,
  Flame,
  Sparkles,
  BookOpen
} from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { StudyLoader } from "@/components/ui/study-loader"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  topic: string
  subject_id?: number
  subject?: string
  source?: { material_id: number; title: string; page: number }
  source_evidence?: string
}

interface QuizData {
  quiz_id: string
  title: string
  subject: string
  difficulty: string
  questions: QuizQuestion[]
  total_questions: number
  estimated_time: number
  learning_objectives: string[]
  passing_score: number
  created_at: string
}

interface QuizResult {
  quiz_id: string
  score: number
  total_questions: number
  correct_answers: number
  time_taken: number
  feedback: string[]
  recommendations: string[]
  topic_performance?: Array<{ topic: string; percentage: number; correct: number; total: number }>
  weakest_topic?: string | null
  current_streak?: number
}

function QuizContent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast, ToastContainer } = useToast()
  
  // Quiz state
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [oneMinuteWarningShown, setOneMinuteWarningShown] = useState(false)
  const [simpleExplanations, setSimpleExplanations] = useState<Record<string, string>>({})
  const [explainingQuestionId, setExplainingQuestionId] = useState<string | null>(null)
  
  // Quiz parameters from URL
  const topic = searchParams.get('topic') || 'General Knowledge'
  const difficulty = searchParams.get('difficulty') || 'medium'
  const numQuestions = parseInt(searchParams.get('numQuestions') || '10')
  const timeLimit = parseInt(searchParams.get('timeLimit') || '20')
  const mode = searchParams.get('mode') || 'general'
  const subjectId = Number(searchParams.get('subjectId')) || undefined
  const materialId = Number(searchParams.get('materialId')) || undefined
  const focusTopics = (searchParams.get('topics') || '').split(',').map((item) => item.trim()).filter(Boolean)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Generate quiz when component mounts
  useEffect(() => {
    if (isAuthenticated && !quizData) {
      generateQuiz()
    }
  }, [isAuthenticated])

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
        
        // Show 1-minute warning
        if (timeRemaining === 60 && !oneMinuteWarningShown) {
          showToast("⏰ You have 1 minute remaining! Hurry up!", 'warning', 8000)
          setOneMinuteWarningShown(true)
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else if (quizStarted && timeRemaining === 0) {
      // Auto-submit when time runs out
      showToast("⏰ Time's up! Quiz submitted automatically.", 'warning', 5000)
      submitQuiz(true) // Pass true for automatic submission
    }
  }, [quizStarted, timeRemaining, oneMinuteWarningShown, showToast])

  const generateQuiz = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.generateQuiz({
        subject: topic,
        difficulty,
        num_questions: numQuestions,
        learning_objectives: [
          `Understand ${topic} concepts`,
          `Apply ${topic} knowledge`,
          `Analyze ${topic} problems`,
        ],
        time_limit: timeLimit,
        mode: mode as 'general' | 'material' | 'topic' | 'weak' | 'mistake' | 'exam' | 'daily',
        subject_id: subjectId,
        material_id: materialId,
        topics: focusTopics.length > 0
          ? focusTopics
          : mode === "weak" || mode === "mistake"
            ? []
            : [topic],
      })
      setQuizData(response)
      setTimeRemaining(response.estimated_time * 60)
    } catch (err) {
      console.error('Failed to generate quiz:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const selectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const explainSimply = async (question: QuizQuestion) => {
    setExplainingQuestionId(question.id)
    try {
      const correctIndex = question.correct_answer.charCodeAt(0) - 65
      const result = await apiClient.getExplanation({
        message: `Explain this missed ${question.topic} question simply. Use a short definition, a plain-language explanation, a real-life example, and finish with one new practice question. Question: ${question.question}. Correct answer: ${question.options[correctIndex]}. Explanation: ${question.explanation}`,
      })
      setSimpleExplanations((current) => ({
        ...current,
        [question.id]: result.response || result.message || "No explanation was returned.",
      }))
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not load the explanation.", "error")
    } finally {
      setExplainingQuestionId(null)
    }
  }

  const practiceSimilarQuestion = (question: QuizQuestion) => {
    const params = new URLSearchParams({
      mode: subjectId ? "topic" : "general",
      topic: quizData?.subject || topic,
      topics: question.topic || topic,
      numQuestions: "5",
    })
    if (subjectId) params.set("subjectId", String(subjectId))
    router.push(`/quiz-setup?${params.toString()}`)
  }

  const openSource = async (sourceMaterialId: number) => {
    try {
      await apiClient.openMaterialSource(sourceMaterialId)
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not open the source PDF.", "error")
    }
  }

  const nextQuestion = () => {
    // Check if an answer is selected for current question
    const currentQuestion = quizData?.questions[currentQuestionIndex]
    const currentAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : null
    if (!currentAnswer) {
      alert('Please select an answer before proceeding to the next question.')
      return
    }
    
    if (currentQuestionIndex < (quizData?.total_questions || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitQuiz = async (isAutoSubmit: boolean = false) => {
    if (!quizData) return

    // Check if all questions are answered (only for manual submission)
    if (!isAutoSubmit) {
      const unansweredQuestions = quizData.questions.filter(question => !selectedAnswers[question.id])
      if (unansweredQuestions.length > 0) {
        alert(`Please answer all questions before submitting. You have ${unansweredQuestions.length} unanswered questions.`)
        return
      }
    }

    try {
      setLoading(true)
      
      // Prepare answers for submission
      const answersForSubmission = quizData.questions.map(question => ({
        question_id: question.id,
        selected_answer: selectedAnswers[question.id] || "",
        is_correct: selectedAnswers[question.id] === question.correct_answer
      }))

      const timeTaken = (quizData.estimated_time * 60) - timeRemaining

      // Prepare questions data for detailed review
      const questionsData: Record<string, any> = {}
      quizData.questions.forEach(question => {
        questionsData[question.id] = {
          question: question.question,
          options: question.options,
          correct_answer: question.correct_answer,
          user_answer: selectedAnswers[question.id] || "",
          is_correct: selectedAnswers[question.id] === question.correct_answer,
          explanation: question.explanation || `This question tests your understanding of ${quizData.subject}.`,
          topic: question.topic,
          subject_id: question.subject_id || subjectId,
          subject: question.subject || quizData.subject,
          source: question.source,
          source_evidence: question.source_evidence,
        }
      })

      const response = await apiClient.submitQuiz({
        quiz_id: quizData.quiz_id,
        answers: answersForSubmission,
        time_taken: timeTaken,
        questions_data: questionsData,
        topic: quizData.subject,
        difficulty: quizData.difficulty,
        subject_id: subjectId,
        mode,
      })
      setQuizResult(response)

      setShowResult(true)
      setQuizStarted(false)
    } catch (err) {
      console.error('Failed to submit quiz:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const restartQuiz = () => {
    setQuizData(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setShowResult(false)
    setQuizResult(null)
    setTimeRemaining(0)
    setQuizStarted(false)
    setError(null)
    setOneMinuteWarningShown(false)
    generateQuiz()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Show loading state
  if (isLoading || loading) {
    return (
      <>
        <ToastContainer />
        <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
          <StudyLoader 
            size="xl" 
            variant="detailed" 
            text="Generating your personalized quiz..."
          />
        </main>
      </>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Show error state
  if (error) {
    return (
      <>
        <ToastContainer />
        <main className="mx-auto max-w-4xl px-4 py-20">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-red-600">Quiz Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={restartQuiz}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    )
  }

  // Show quiz result
  if (showResult && quizResult) {
    const getScoreEmoji = (score: number) => {
      if (score >= 90) return "🏆"
      if (score >= 80) return "🥇"
      if (score >= 70) return "🥈"
      if (score >= 60) return "🥉"
      return "💪"
    }

    const getMotivationalMessage = (score: number) => {
      if (score >= 90) return "Outstanding! You're a true master! 🌟"
      if (score >= 80) return "Excellent work! You're doing amazing! ⭐"
      if (score >= 70) return "Great job! You're on the right track! 🎯"
      if (score >= 60) return "Good effort! Keep practicing and you'll improve! 💪"
      return "Don't give up! Every expert was once a beginner! 🌱"
    }

    const getScoreColor = (score: number) => {
      if (score >= 80) return "text-green-600"
      if (score >= 60) return "text-blue-600"
      return "text-orange-600"
    }

    const getScoreIcon = (score: number) => {
      if (score >= 90) return <Trophy className="h-16 w-16 text-yellow-500" />
      if (score >= 80) return <Star className="h-16 w-16 text-yellow-400" />
      if (score >= 70) return <Heart className="h-16 w-16 text-red-500" />
      if (score >= 60) return <Zap className="h-16 w-16 text-blue-500" />
      return <Flame className="h-16 w-16 text-orange-500" />
    }

    return (
      <>
        <ToastContainer />
        <main className="mx-auto max-w-4xl px-4 py-20">
          <Card className="text-center">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              {getScoreIcon(quizResult.score)}
            </div>
            <CardTitle className="text-3xl mb-2">
              {getScoreEmoji(quizResult.score)} {getMotivationalMessage(quizResult.score)}
            </CardTitle>
            <div className="text-lg text-muted-foreground">
              You completed the {topic} quiz!
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display with Enhanced Styling */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(quizResult.score)}`}>
                  {quizResult.score.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground font-medium">Final Score</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {quizResult.score >= 80 ? "Outstanding!" : quizResult.score >= 60 ? "Good Job!" : "Keep Trying!"}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-4xl font-bold text-green-600">
                  {quizResult.correct_answers}/{quizResult.total_questions}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Correct Answers</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {quizResult.correct_answers === quizResult.total_questions ? "Perfect!" : "Well Done!"}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-4xl font-bold text-purple-600">
                  {Math.floor(quizResult.time_taken / 60)}:{(quizResult.time_taken % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Time Taken</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {quizResult.time_taken < 300 ? "Lightning Fast! ⚡" : 
                   quizResult.time_taken < 600 ? "Good Pace! 🏃" : 
                   quizResult.time_taken < 1200 ? "Steady Progress! 🚶" : "Thorough Analysis! 🧠"}
                </div>
              </div>
            </div>

            {/* Detailed Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((quizResult.correct_answers / quizResult.total_questions) * 100)}%
                  </div>
                  <div className="text-sm text-green-700 font-medium">Accuracy Rate</div>
                  <div className="text-xs text-green-600 mt-1">
                    {quizResult.correct_answers} out of {quizResult.total_questions} correct
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(quizResult.time_taken / quizResult.total_questions)}s
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Avg. Time per Question</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {quizResult.time_taken < 300 ? "Very Fast!" : "Good Timing!"}
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Sticker */}
            <div className="text-center py-4">
              <div className="text-6xl mb-2">
                {quizResult.score >= 90 ? "🎉" : quizResult.score >= 80 ? "🎊" : quizResult.score >= 70 ? "🎯" : quizResult.score >= 60 ? "💪" : "🌱"}
              </div>
              <div className="text-lg font-semibold text-muted-foreground">
                {quizResult.score >= 90 ? "Quiz Master!" : 
                 quizResult.score >= 80 ? "Excellent Performance!" : 
                 quizResult.score >= 70 ? "Great Job!" : 
                 quizResult.score >= 60 ? "Keep Improving!" : "Never Give Up!"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Completed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Feedback:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {quizResult.feedback.map((feedback, index) => (
                  <li key={index}>• {feedback}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Recommendations:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {quizResult.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>

            {quizResult.topic_performance && quizResult.topic_performance.length > 0 && (
              <div className="space-y-3 rounded-lg border p-4 text-left">
                <h3 className="font-semibold">Topic performance · Practice Readiness Estimate</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {quizResult.topic_performance.map((item) => (
                    <div key={item.topic} className="flex items-center justify-between rounded bg-muted/40 px-3 py-2 text-sm">
                      <span>{item.topic}</span>
                      <span className={item.percentage < 60 ? "font-semibold text-red-600" : "font-semibold"}>
                        {item.percentage}% ({item.correct}/{item.total})
                      </span>
                    </div>
                  ))}
                </div>
                {quizResult.weakest_topic && (
                  <p className="text-sm text-muted-foreground">
                    Your weakest topic this time is <strong>{quizResult.weakest_topic}</strong>. Practice it next.
                  </p>
                )}
              </div>
            )}

            {quizResult.current_streak !== undefined && (
              <p className="text-sm text-muted-foreground">🔥 Current learning streak: {quizResult.current_streak} day{quizResult.current_streak === 1 ? "" : "s"}</p>
            )}

            <div className="space-y-3 text-left">
              <h3 className="font-semibold">Review your answers</h3>
              {quizData?.questions.map((question) => {
                const selected = selectedAnswers[question.id] || ""
                const correct = selected === question.correct_answer
                if (correct) return null
                const selectedIndex = selected ? selected.charCodeAt(0) - 65 : -1
                const correctIndex = question.correct_answer.charCodeAt(0) - 65
                return (
                  <div key={question.id} className="space-y-2 rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline">{question.topic}</Badge>
                      {!correct && <Badge variant="destructive">Incorrect</Badge>}
                    </div>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm text-red-700">Your answer: {selectedIndex >= 0 ? question.options[selectedIndex] : "Not answered"}</p>
                    <p className="text-sm text-green-700">Correct answer: {question.options[correctIndex]}</p>
                    <p className="text-sm text-muted-foreground">Why? {question.explanation}</p>
                    {question.source && (
                      <p className="text-sm text-muted-foreground">
                        Source: {question.source.title} · Page {question.source.page}{" "}
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => void openSource(question.source!.material_id)}>
                          View Source
                        </Button>
                      </p>
                    )}
                    {simpleExplanations[question.id] && (
                      <p className="rounded bg-muted/50 p-3 text-sm">{simpleExplanations[question.id]}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => void explainSimply(question)} disabled={explainingQuestionId === question.id}>
                        {explainingQuestionId === question.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                        Explain Simply
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => practiceSimilarQuestion(question)}>
                        Try a similar question
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={restartQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Quiz
              </Button>
              <Button onClick={() => router.push('/dashboard')}>
                <Target className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      </>
    )
  }

  // Show quiz start screen
  if (quizData && !quizStarted) {
    return (
      <>
        <ToastContainer />
        <main className="mx-auto max-w-4xl px-4 py-20">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <CardTitle className="text-3xl">{quizData.title}</CardTitle>
              <p className="text-muted-foreground mt-2">Get ready to test your knowledge!</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">{quizData.total_questions} Questions</div>
                    <div className="text-sm text-blue-700">Multiple choice format</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">{quizData.estimated_time} Minutes</div>
                    <div className="text-sm text-green-700">Time limit for completion</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                    {quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1)}
                  </Badge>
                  <div>
                    <div className="font-semibold text-purple-900">Difficulty Level</div>
                    <div className="text-sm text-purple-700">
                      {quizData.difficulty === 'easy' ? 'Basic concepts' : 
                       quizData.difficulty === 'medium' ? 'Moderate complexity' : 'Advanced topics'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900">{quizData.subject}</div>
                    <div className="text-sm text-orange-700">Subject area</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Learning Objectives:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {quizData.learning_objectives.map((objective, index) => (
                  <li key={index}>• {objective}</li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={startQuiz} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      </>
    )
  }

  // Show quiz questions
  if (quizData && quizStarted && !showResult) {
    const currentQuestion = quizData.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizData.total_questions) * 100
    const isLastQuestion = currentQuestionIndex === quizData.total_questions - 1

    return (
      <>
        <ToastContainer />
        <main className="mx-auto max-w-4xl px-4 py-20">
          {/* Enhanced Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-blue-700 bg-blue-50">
                {quizData.subject}
              </Badge>
              <Badge variant="secondary" className="text-purple-700 bg-purple-50">
                {quizData.difficulty.charAt(0).toUpperCase() + quizData.difficulty.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-mono text-red-700 font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">
                  {currentQuestionIndex + 1} / {quizData.total_questions}
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentQuestionIndex + 1}</span>
          <span>{quizData.total_questions - currentQuestionIndex - 1} remaining</span>
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {quizData.questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestionIndex 
                  ? 'bg-blue-500' 
                  : selectedAnswers[quizData.questions[index].id] 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">
              {currentQuestion.question}
            </div>
            {currentQuestion.source && (
              <div className="flex flex-wrap items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Source: {currentQuestion.source.title}, page {currentQuestion.source.page}
                <Button variant="link" size="sm" className="h-auto p-0" onClick={() => void openSource(currentQuestion.source!.material_id)}>
                  View Source
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
                const isSelected = selectedAnswers[currentQuestion.id] === optionLetter
                
                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(currentQuestion.id, optionLetter)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary text-white' : 'border-border'
                      }`}>
                        {isSelected && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <span className="font-medium">{optionLetter}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                onClick={previousQuestion} 
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button onClick={() => submitQuiz(false)} disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <StudyLoader size="sm" variant="minimal" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>
                      Submit Quiz
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      </>
    )
  }

  return (
    <>
      <ToastContainer />
      {null}
    </>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Preparing your quiz experience..."
        />
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
