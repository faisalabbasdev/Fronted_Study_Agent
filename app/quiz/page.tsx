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
  
  // Quiz parameters from URL
  const topic = searchParams.get('topic') || 'General Knowledge'
  const difficulty = searchParams.get('difficulty') || 'medium'
  const numQuestions = parseInt(searchParams.get('numQuestions') || '10')
  const timeLimit = parseInt(searchParams.get('timeLimit') || '20')

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
      
      // Use the professional quiz generation API
      
      try {
        const response = await apiClient.generateQuiz({
          subject: topic,
          difficulty: difficulty,
          num_questions: numQuestions,
          topics: [topic],
          learning_objectives: [
            `Understand ${topic} concepts`,
            `Apply ${topic} knowledge`, 
            `Analyze ${topic} problems`
          ],
          time_limit: timeLimit
        })
        
        setQuizData(response)
        setTimeRemaining(response.estimated_time * 60)
        return
        
      } catch (apiError) {
        console.warn('Professional quiz API failed, trying AI agent fallback:', apiError)
        
        // Fallback to AI agent with retry logic
        let maxRetries = 3
        let retryCount = 0
        
        while (retryCount < maxRetries) {
          try {
            
            // Use the AI agent to generate quiz questions
            const agentResponse = await apiClient.chatWithAgent({
              message: `Generate a comprehensive ${difficulty} level quiz about ${topic} with exactly ${numQuestions} multiple choice questions. 

CRITICAL REQUIREMENTS:
- All questions must be FACTUALLY ACCURATE
- Correct answers must be 100% correct
- Wrong options must be plausible but clearly incorrect
- Questions must be specifically about ${topic}
- Difficulty level: ${difficulty}
- Generate EXACTLY ${numQuestions} questions, no more, no less

FORMAT (use this EXACT format):
Question 1: [Your question here]
A) [Option A]
B) [Option B] 
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Detailed explanation of why the correct answer is right]

Question 2: [Your question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Detailed explanation of why the correct answer is right]

Continue this pattern for all ${numQuestions} questions. Double-check that all correct answers are factually accurate.`,
              context: {
                mode: 'quiz_generation',
                topic: topic,
                difficulty: difficulty,
                num_questions: numQuestions,
                time_limit: timeLimit,
                user_level: 'student',
                retry_attempt: retryCount + 1
              }
            })
            
            if (agentResponse && agentResponse.response) {
              // Parse the AI response to extract quiz questions
              const parsedQuiz = parseAIQuizResponse(agentResponse.response, topic, difficulty, numQuestions, timeLimit)
              if (parsedQuiz && parsedQuiz.questions.length >= numQuestions) {
                setQuizData(parsedQuiz)
                setTimeRemaining(parsedQuiz.estimated_time * 60)
                return
              } else {
                console.warn(`AI agent generated only ${parsedQuiz?.questions.length || 0} questions, need ${numQuestions}`)
              }
            }
            
            retryCount++
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
            }
            
          } catch (agentError) {
            console.warn(`AI agent attempt ${retryCount + 1} failed:`, agentError)
            retryCount++
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
            }
          }
        }
        
        // If all attempts failed, show error
        throw new Error('Both professional quiz API and AI agent failed to generate accurate quiz. Please try again.')
      }
      
    } catch (err) {
      console.error('Failed to generate quiz:', err)
      setError('Failed to generate quiz. The AI agent could not create accurate questions. Please try again.')
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

      // Calculate score locally
      const correctAnswers = answersForSubmission.filter(answer => answer.is_correct).length
      const totalQuestions = answersForSubmission.length
      const score = (correctAnswers / totalQuestions) * 100
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
          explanation: question.explanation || `This question tests your understanding of ${quizData.subject}.`
        }
      })

      // Try to submit to API first, but have fallback
      try {
        const response = await apiClient.submitQuiz({
          quiz_id: quizData.quiz_id,
          answers: answersForSubmission,
          time_taken: timeTaken,
          questions_data: questionsData,
          topic: quizData.subject,
          difficulty: quizData.difficulty
        })
        setQuizResult(response)
      } catch (apiError) {
        console.warn('API submission failed, using local calculation:', apiError)
        
        // Fallback: Calculate results locally
        const feedback = []
        const recommendations = []
        
        if (score >= 90) {
          feedback.push("Excellent work! You have mastered this topic.")
          recommendations.push("Try more advanced questions to challenge yourself")
        } else if (score >= 80) {
          feedback.push("Great job! You have a strong understanding of this topic.")
          recommendations.push("Continue practicing to maintain your knowledge")
        } else if (score >= 70) {
          feedback.push("Good work! You have a solid understanding of most concepts.")
          recommendations.push("Review the questions you missed and practice more")
        } else if (score >= 60) {
          feedback.push("Not bad! You're making progress in this subject.")
          recommendations.push("Focus on the areas where you struggled")
        } else {
          feedback.push("Keep practicing! Every mistake is a learning opportunity.")
          recommendations.push("Review the fundamental concepts before trying again")
        }
        
        feedback.push(`You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`)
        feedback.push(`Your score: ${score.toFixed(1)}%`)
        
        recommendations.push("Take another quiz to reinforce your learning")
        recommendations.push("Review the explanations for questions you missed")

        const localResult: QuizResult = {
          quiz_id: quizData.quiz_id,
          score: score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_taken: timeTaken,
          feedback: feedback,
          recommendations: recommendations
        }
        
        setQuizResult(localResult)
      }

      setShowResult(true)
      setQuizStarted(false)
    } catch (err) {
      console.error('Failed to submit quiz:', err)
      setError('Failed to submit quiz. Please try again.')
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

  // Validation function to ensure quiz accuracy
  const validateQuizQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
    return questions.map(question => {
      // Ensure correct_answer is valid
      if (!['A', 'B', 'C', 'D'].includes(question.correct_answer)) {
        console.warn(`Invalid correct_answer for question ${question.id}: ${question.correct_answer}`)
        question.correct_answer = 'A' // Default fallback
      }
      
      // Ensure options array has exactly 4 items
      if (!question.options || question.options.length !== 4) {
        console.warn(`Invalid options for question ${question.id}`)
        question.options = ["Option A", "Option B", "Option C", "Option D"]
      }
      
      // Ensure question text exists
      if (!question.question || question.question.trim() === '') {
        console.warn(`Empty question text for question ${question.id}`)
        question.question = `Question about ${question.topic}`
      }
      
      return question
    })
  }

  // Removed fallback question generation - now using only AI agent

  const parseAIQuizResponse = (response: string, topic: string, difficulty: string, numQuestions: number, timeLimit: number): QuizData | null => {
    try {
      
      // More flexible parsing - handle different formats
      const questionRegex = /Question\s+(\d+):\s*([^\n]+)/gi
      const optionRegex = /^[A-D][\.\)]\s+(.+)$/gm
      const answerRegex = /correct\s+answer:?\s*([A-D])/gi
      const explanationRegex = /explanation:?\s*(.+)$/gim
      
      const questions: QuizQuestion[] = []
      let match
      
      // Find all questions
      const questionMatches = [...response.matchAll(questionRegex)]
      
      for (let i = 0; i < questionMatches.length && questions.length < numQuestions; i++) {
        const questionMatch = questionMatches[i]
        const questionNumber = questionMatch[1]
        const questionText = questionMatch[2].trim()
        
        // Find the section for this question
        const questionStart = questionMatch.index!
        const nextQuestionStart = i + 1 < questionMatches.length ? questionMatches[i + 1].index! : response.length
        const questionSection = response.substring(questionStart, nextQuestionStart)
        
        // Extract options
        const options: string[] = []
        const optionMatches = [...questionSection.matchAll(optionRegex)]
        for (const optionMatch of optionMatches) {
          const optionText = optionMatch[1].trim()
          if (optionText) {
            options.push(optionText)
          }
        }
        
        // Extract correct answer
        const answerMatch = questionSection.match(answerRegex)
        const correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : ''
        
        // Extract explanation
        const explanationMatch = questionSection.match(explanationRegex)
        const explanation = explanationMatch ? explanationMatch[1].trim() : `This question tests your understanding of ${topic}.`
        
        // Validate we have all required components
        if (questionText && options.length >= 4 && correctAnswer && ['A', 'B', 'C', 'D'].includes(correctAnswer)) {
          // Ensure we have exactly 4 options
          const finalOptions = options.slice(0, 4)
          if (finalOptions.length === 4) {
            questions.push({
              id: `q_${questions.length + 1}`,
              question: questionText,
              options: finalOptions,
              correct_answer: correctAnswer,
              explanation: explanation,
              difficulty: difficulty,
              topic: topic
            })
          }
        }
      }
      
      
      // If we got enough questions from AI, use them
      if (questions.length >= numQuestions) {
        const validatedQuestions = validateQuizQuestions(questions.slice(0, numQuestions))
        return {
          quiz_id: `ai_quiz_${topic.toLowerCase().replace(/\s+/g, '-')}_${difficulty}_${Date.now()}`,
          title: `${topic} Quiz (AI Generated)`,
          subject: topic,
          difficulty: difficulty,
          questions: validatedQuestions,
          total_questions: validatedQuestions.length,
          estimated_time: timeLimit,
          learning_objectives: [
            `Understand ${topic} concepts`,
            `Apply ${topic} knowledge`,
            `Analyze ${topic} problems`
          ],
          passing_score: 70.0,
          created_at: new Date().toISOString()
        }
      }
      
      console.warn(`AI generated only ${questions.length} questions, need ${numQuestions}`)
      return null
    } catch (error) {
      console.error('Error parsing AI quiz response:', error)
      return null
    }
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
