"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  Zap,
  Star,
  Trophy,
  Loader2
} from "lucide-react"
import { StudyLoader } from "@/components/ui/study-loader"
import { apiClient, StudentSubject } from "@/lib/api"

interface QuizSetupData {
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  numQuestions: number
  timeLimit: number
  mode: 'general' | 'material' | 'topic' | 'weak' | 'mistake' | 'exam' | 'daily'
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', description: 'Basic concepts and fundamentals', icon: BookOpen, color: 'text-green-600' },
  { value: 'medium', label: 'Medium', description: 'Moderate complexity and application', icon: Brain, color: 'text-blue-600' },
  { value: 'hard', label: 'Hard', description: 'Complex concepts and analysis', icon: Target, color: 'text-red-600' }
]

const questionCountOptions = [
  { value: 5, label: '5 Questions', time: 10 },
  { value: 10, label: '10 Questions', time: 20 },
  { value: 15, label: '15 Questions', time: 30 },
  { value: 20, label: '20 Questions', time: 40 }
]

const educationalTopics = [
  // Core Subjects
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'History', 
  'Geography', 'English Literature', 'Computer Science', 'Programming',
  'Economics', 'Psychology', 'Art History', 'World History', 'Algebra',
  'Geometry', 'Calculus', 'Statistics', 'Anatomy', 'Astronomy',
  
  // Modern Technology & AI
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cybersecurity',
  'Web Development', 'Mobile Development', 'Cloud Computing', 'Blockchain',
  'Robotics', 'Internet of Things', 'Quantum Computing', 'Augmented Reality',
  
  // Advanced Academic Subjects
  'Philosophy', 'Political Science', 'Sociology', 'Anthropology', 'Linguistics',
  'Environmental Science', 'Biotechnology', 'Neuroscience', 'Genetics',
  'Organic Chemistry', 'Quantum Physics', 'Linear Algebra', 'Differential Equations',
  
  // Professional & Career Skills
  'Business Management', 'Marketing', 'Finance', 'Accounting', 'Project Management',
  'Digital Marketing', 'Entrepreneurship', 'Leadership', 'Communication Skills',
  'Critical Thinking', 'Research Methods', 'Academic Writing', 'Presentation Skills',
  
  // Language & Arts
  'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Latin',
  'Creative Writing', 'Poetry', 'Drama', 'Music Theory', 'Visual Arts',
  
  // Health & Medicine
  'Medicine', 'Nursing', 'Public Health', 'Nutrition', 'Exercise Science',
  'Mental Health', 'Pharmacology', 'Pathology', 'Immunology'
]

export default function QuizSetupPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [setupData, setSetupData] = useState<QuizSetupData>({
    topic: '',
    difficulty: 'medium',
    numQuestions: 10,
    timeLimit: 20,
    mode: 'general'
  })
  
  const [topicError, setTopicError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customTopic, setCustomTopic] = useState('')
  const [subjects, setSubjects] = useState<StudentSubject[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [focusTopics, setFocusTopics] = useState('')

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    if (!isAuthenticated) return
    apiClient.getLearningSubjects()
      .then((items) => setSubjects(items))
      .catch((error) => console.error("Failed to load study subjects:", error))

    const params = new URLSearchParams(window.location.search)
    const mode = params.get("mode")
    const subjectId = Number(params.get("subjectId"))
    const topic = params.get("topic") || ""
    const topics = params.get("topics") || ""
    const questionCount = Number(params.get("numQuestions"))
    if (mode && ["general", "material", "topic", "weak", "mistake", "exam", "daily"].includes(mode)) {
      setSetupData((previous) => ({ ...previous, mode: mode as QuizSetupData["mode"] }))
    }
    if (Number.isInteger(subjectId) && subjectId > 0) setSelectedSubjectId(subjectId)
    if (topic) {
      setCustomTopic(topic)
      setSetupData((previous) => ({ ...previous, topic }))
    }
    if (topics) setFocusTopics(topics.split(",").join(", "))
    if (questionCount >= 5 && questionCount <= 20) handleQuestionCountChange(questionCount)
  }, [isAuthenticated])

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId)

  useEffect(() => {
    if (selectedSubject && !customTopic.trim()) {
      setCustomTopic(selectedSubject.name)
      setSetupData((previous) => previous.topic ? previous : { ...previous, topic: selectedSubject.name })
    }
  }, [selectedSubject, customTopic])

  const validateTopic = (topic: string): boolean => {
    const lowerTopic = topic.toLowerCase().trim()
    
    // Only block clearly non-educational topics
    const nonEducationalKeywords = [
      'chai banao', 'cricket match', 'football match', 'movie review', 'celebrity gossip',
      'dating advice', 'relationship tips', 'shopping deals', 'fashion trends',
      'gaming tips', 'sports betting', 'gambling', 'lottery', 'casino',
      'gossip', 'rumor', 'scandal', 'drama', 'fight', 'argument'
    ]
    
    // Check for clearly non-educational topics
    for (const keyword of nonEducationalKeywords) {
      if (lowerTopic.includes(keyword)) {
        return false
      }
    }
    
    // Allow any topic that seems educational or learning-related
    // This includes traditional subjects, skills, hobbies that can be learned, etc.
    return true
  }

  const handleTopicChange = (topic: string) => {
    setCustomTopic(topic)
    setTopicError(null)
    
    if (topic.trim()) {
      const isValid = validateTopic(topic)
      if (!isValid) {
        setTopicError("Please enter a learning topic 📚. Any subject you want to study and learn about!")
      }
    }
  }

  const handleGenerateQuiz = async () => {
    if (!setupData.topic && !customTopic.trim() && !selectedSubject) {
      setTopicError("Please enter a topic for your quiz")
      return
    }
    if (setupData.mode !== 'general' && !selectedSubjectId) {
      setTopicError("Choose one of your subjects for personalized practice")
      return
    }
    
    if (topicError) {
      return
    }
    
    setIsGenerating(true)
    
    // Prepare quiz parameters
    const finalTopic = setupData.mode !== "general" && selectedSubject
      ? selectedSubject.name
      : customTopic.trim() || setupData.topic
    const quizParams = new URLSearchParams({
      topic: finalTopic,
      difficulty: setupData.difficulty,
      numQuestions: setupData.numQuestions.toString(),
      timeLimit: setupData.timeLimit.toString(),
      mode: setupData.mode,
    })
    if (selectedSubjectId) quizParams.set("subjectId", String(selectedSubjectId))
    if (selectedMaterialId) quizParams.set("materialId", String(selectedMaterialId))
    if (focusTopics.trim()) quizParams.set("topics", focusTopics.split(",").map((topic) => topic.trim()).filter(Boolean).join(","))
    
    // Navigate to quiz page with parameters
    router.push(`/quiz?${quizParams.toString()}`)
  }

  const handlePresetTopic = (topic: string) => {
    setSetupData(prev => ({ ...prev, topic }))
    setCustomTopic('')
    setTopicError(null)
  }

  const handleQuestionCountChange = (count: number) => {
    const timeOption = questionCountOptions.find(opt => opt.value === count)
    setSetupData(prev => ({
      ...prev,
      numQuestions: count,
      timeLimit: timeOption?.time || 20
    }))
  }

  if (isLoading) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Preparing quiz setup..."
        />
      </main>
    )
  }

  return (
    <main className="tayyar-quiz-setup mx-auto max-w-4xl px-4 py-20">
      <header className="tayyar-quiz-heading">
        <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> PERSONALIZED PRACTICE</p>
        <h1>Build a quiz<br /><span>with a clear focus.</span></h1>
        <p>Choose a subject, material, or topic and shape a practice session around what you want to strengthen.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Topic Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Choose Your Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="quiz-mode" className="mb-2 block text-sm font-medium">Practice mode</label>
              <select
                id="quiz-mode"
                className="w-full rounded-md border bg-background px-3 py-2"
                value={setupData.mode}
                onChange={(event) => setSetupData((previous) => ({ ...previous, mode: event.target.value as QuizSetupData["mode"] }))}
              >
                <option value="general">General topic quiz</option>
                <option value="material">Quiz from my material</option>
                <option value="topic">Topic practice</option>
                <option value="weak">Weak-topic practice</option>
                <option value="mistake">Practice my mistakes</option>
                <option value="exam">Exam preparation</option>
                <option value="daily">Today&apos;s recommended practice</option>
              </select>
              {setupData.mode !== "general" && (
                <div className="mt-3 space-y-3 rounded-lg bg-muted/40 p-3">
                  <label htmlFor="subject-select" className="block text-sm font-medium">Subject</label>
                  <select
                    id="subject-select"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={selectedSubjectId || ""}
                    onChange={(event) => {
                      const id = Number(event.target.value) || null
                      setSelectedSubjectId(id)
                      setSelectedMaterialId(null)
                      const subject = subjects.find((item) => item.id === id)
                      if (subject) {
                        setCustomTopic(subject.name)
                        setSetupData((previous) => ({ ...previous, topic: subject.name }))
                      }
                    }}
                  >
                    <option value="">Choose a subject</option>
                    {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                  </select>
                  {selectedSubject && (
                    <>
                      <label htmlFor="material-select" className="block text-sm font-medium">Source PDF (optional)</label>
                      <select
                        id="material-select"
                        className="w-full rounded-md border bg-background px-3 py-2"
                        value={selectedMaterialId || ""}
                        onChange={(event) => setSelectedMaterialId(Number(event.target.value) || null)}
                      >
                        <option value="">All material for {selectedSubject.name}</option>
                        {selectedSubject.materials.map((material) => (
                          <option key={material.id} value={material.id}>{material.title}</option>
                        ))}
                      </select>
                    </>
                  )}
                  <label htmlFor="focus-topics" className="block text-sm font-medium">Focus topics (comma-separated, optional)</label>
                  <Input id="focus-topics" placeholder="e.g. classification, regression" value={focusTopics} onChange={(event) => setFocusTopics(event.target.value)} />
                  {subjects.length === 0 && (
                    <p className="text-xs text-muted-foreground">Add a subject and upload a PDF from your dashboard to use personalized modes.</p>
                  )}
                </div>
              )}
            </div>
            {/* Custom Topic Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Enter Your Topic</label>
              <Input
                placeholder="e.g., Mathematics, Science, History..."
                value={customTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                className={topicError ? "border-red-500" : ""}
              />
              {topicError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{topicError}</span>
                </div>
              )}
              {customTopic && !topicError && (
                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Great educational topic! 📚</span>
                </div>
              )}
            </div>

            {/* Preset Topics */}
            <div>
              <label className="text-sm font-medium mb-3 block">Or choose from popular topics:</label>
              
              {/* Core Subjects */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Core Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {educationalTopics.slice(0, 8).map((topic) => (
                    <Badge
                      key={topic}
                      variant={setupData.topic === topic ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handlePresetTopic(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Modern Technology */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Modern Technology & AI</h4>
                <div className="flex flex-wrap gap-2">
                  {educationalTopics.slice(8, 16).map((topic) => (
                    <Badge
                      key={topic}
                      variant={setupData.topic === topic ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handlePresetTopic(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Advanced Subjects */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Advanced & Professional</h4>
                <div className="flex flex-wrap gap-2">
                  {educationalTopics.slice(16, 24).map((topic) => (
                    <Badge
                      key={topic}
                      variant={setupData.topic === topic ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handlePresetTopic(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Quiz Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Difficulty Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Difficulty Level</label>
              <div className="space-y-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSetupData(prev => ({ ...prev, difficulty: option.value as any }))}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      setupData.difficulty === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className={`h-5 w-5 ${option.color}`} />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="text-sm font-medium mb-3 block">Number of Questions</label>
              <div className="grid grid-cols-2 gap-2">
                {questionCountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleQuestionCountChange(option.value)}
                    className={`p-3 text-center rounded-lg border-2 transition-colors ${
                      setupData.numQuestions === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.time} min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit Display */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Time Limit: {setupData.timeLimit} minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !!topicError || (!setupData.topic && !customTopic.trim())}
          size="lg"
          className="px-8"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <StudyLoader size="sm" variant="minimal" />
              <span>Generating Quiz...</span>
            </div>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Generate Quiz
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Features Preview */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 text-center">What You'll Get 🎁</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Personalized Questions</h3>
              <p className="text-sm text-muted-foreground">Questions tailored to your chosen topic and difficulty level</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Progress</h3>
              <p className="text-sm text-muted-foreground">Track your progress with live timer and question counter</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Detailed Feedback</h3>
              <p className="text-sm text-muted-foreground">Get comprehensive results with explanations and recommendations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
