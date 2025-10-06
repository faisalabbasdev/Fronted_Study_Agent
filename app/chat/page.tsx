"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { MessageBubble } from "@/components/chat/message-bubble"
import ChatInput from "@/components/chat/chat-input"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Suspense } from "react"
import { 
  ModeHeader, 
  ModeMessageBubble, 
  ModeTypingIndicator, 
  ModeInputArea, 
  ModeQuickActions,
  modeThemes 
} from "@/components/chat/mode-specific-ui"
import { StudyLoader } from "@/components/ui/study-loader"

type Msg = { id: string; role: "user" | "ai"; content: string }

function ChatPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'beginner'
  const { user } = useAuth()
  
  const [messages, setMessages] = React.useState<Msg[]>([])
  const [typing, setTyping] = React.useState(false)
  const [sessionId, setSessionId] = React.useState<string | null>(null)
  const [currentSession, setCurrentSession] = React.useState<any>(null)
  const [showSessionOptions, setShowSessionOptions] = React.useState(false)
  const [sessionTopic, setSessionTopic] = React.useState<string>("General Study Session")
  const [sessionCreated, setSessionCreated] = React.useState<boolean>(false)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  // Function to extract topic from user message
  const extractTopicFromMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim()
    
    // Common educational topics with comprehensive keywords
    const topicKeywords = {
      'Mathematics': ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'arithmetic', 'equation', 'formula', 'derivative', 'integral', 'function', 'polynomial', 'quadratic', 'linear', 'probability'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'earth science', 'astronomy', 'anatomy', 'photosynthesis', 'cell', 'molecule', 'atom', 'element', 'compound', 'reaction', 'force', 'energy', 'motion', 'gravity', 'evolution', 'ecosystem'],
      'Programming': ['programming', 'coding', 'python', 'javascript', 'java', 'c++', 'html', 'css', 'react', 'node', 'function', 'variable', 'loop', 'array', 'object', 'class', 'method', 'algorithm', 'debug', 'compile', 'syntax'],
      'English': ['english', 'grammar', 'literature', 'writing', 'reading', 'essay', 'poetry', 'novel', 'sentence', 'paragraph', 'vocabulary', 'spelling', 'punctuation', 'metaphor', 'simile', 'character', 'plot', 'theme'],
      'History': ['history', 'world history', 'ancient', 'medieval', 'renaissance', 'war', 'civilization', 'empire', 'revolution', 'battle', 'treaty', 'monarchy', 'democracy', 'timeline', 'century', 'decade'],
      'Geography': ['geography', 'countries', 'capitals', 'continents', 'oceans', 'mountains', 'rivers', 'climate', 'weather', 'population', 'culture', 'language', 'religion', 'economy', 'resources'],
      'Art': ['art', 'painting', 'drawing', 'sculpture', 'design', 'color', 'artist', 'canvas', 'brush', 'palette', 'composition', 'perspective', 'shading', 'texture', 'gallery', 'museum'],
      'Music': ['music', 'instrument', 'piano', 'guitar', 'violin', 'composer', 'song', 'melody', 'harmony', 'rhythm', 'note', 'scale', 'chord', 'symphony', 'orchestra', 'concert'],
      'Psychology': ['psychology', 'behavior', 'mind', 'brain', 'emotion', 'personality', 'cognitive', 'memory', 'learning', 'motivation', 'stress', 'anxiety', 'therapy', 'consciousness'],
      'Economics': ['economics', 'money', 'finance', 'business', 'market', 'trade', 'supply', 'demand', 'inflation', 'gdp', 'investment', 'budget', 'profit', 'loss', 'revenue'],
      'Philosophy': ['philosophy', 'ethics', 'logic', 'morality', 'existence', 'truth', 'reality', 'knowledge', 'wisdom', 'virtue', 'justice', 'freedom', 'determinism', 'metaphysics'],
      'Computer Science': ['computer science', 'algorithms', 'data structures', 'software engineering', 'database', 'network', 'security', 'operating system', 'artificial intelligence', 'machine learning'],
      'Artificial Intelligence': ['ai', 'artificial intelligence', 'machine learning', 'neural network', 'deep learning', 'algorithm', 'model', 'training', 'prediction', 'classification', 'regression']
    }
    
    // Find matching topic with priority scoring
    let bestMatch = { topic: 'General Study Session', score: 0 }
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      let score = 0
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          // Longer keywords get higher scores
          score += keyword.length
          // Exact matches get bonus points
          if (lowerMessage === keyword) {
            score += 10
          }
        }
      }
      
      if (score > bestMatch.score) {
        bestMatch = { topic, score }
      }
    }
    
    // If we found a good match, return it
    if (bestMatch.score > 0) {
      return bestMatch.topic
    }
    
    // Try to extract from question patterns
    const questionPatterns = [
      /(?:what is|what are|explain|tell me about|how does|how do)\s+(.+?)(?:\?|$)/i,
      /(?:can you help me with|i need help with|i want to learn about)\s+(.+?)(?:\?|$)/i,
      /(?:teach me|show me|help me understand)\s+(.+?)(?:\?|$)/i
    ]
    
    for (const pattern of questionPatterns) {
      const match = lowerMessage.match(pattern)
      if (match && match[1]) {
        const subject = match[1].trim()
        if (subject.length > 2 && subject.length < 50) {
          // Capitalize first letter of each word
          return subject.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
        }
      }
    }
    
    // Default fallback
    return "General Study Session"
  }

  // Initialize chat based on mode
  React.useEffect(() => {
    const initializeChat = async () => {
      const modeMessages = {
        beginner: `🌱 **Welcome to Beginner Mode!** 

Hi there! I'm your friendly AI Study Assistant, and I'm here to help you learn in the most comfortable way possible! 

✨ **What I can do for you:**
• Explain complex topics in simple, easy-to-understand language
• Provide real-world examples that make learning fun
• Break down difficult concepts into small, manageable steps
• Answer all your "silly" questions (there are no silly questions!)
• Encourage you every step of the way

🎯 **Just tell me what you'd like to learn about!** Whether it's math, science, history, or anything else - I'm here to help you succeed! 

What topic interests you today? 😊`,
        
        practice: `🎯 **Welcome to Practice Mode!**

Hello! I'm your AI Study Assistant in Practice Mode, and I'm excited to help you master new skills through hands-on practice!

💪 **What I specialize in:**
• Interactive exercises and practice problems
• Step-by-step solutions with detailed explanations
• Hints and guidance without giving away answers
• Multiple approaches to solving problems
• Immediate feedback on your attempts
• Building your problem-solving confidence

🚀 **Ready to practice?** Just tell me what subject you'd like to work on, and I'll create engaging exercises tailored to your level!

What would you like to practice today?`,
        
        exam: `📝 **Welcome to Exam Mode!**

Greetings! I'm your AI Study Assistant in Exam Mode, and I'm here to help you excel in your assessments and exams!

🏆 **How I can help you succeed:**
• Create timed quizzes to simulate real exam conditions
• Review key concepts and important topics
• Provide comprehensive study strategies
• Analyze your performance and identify areas for improvement
• Offer memory techniques and exam preparation tips
• Build your confidence for test-taking

⏰ **Let's get you exam-ready!** Tell me what subject you're preparing for, and I'll create a focused study plan with assessments.

What exam or assessment are you preparing for?`,
        
        assistant: `🤖 **Welcome to AI Assistant Mode!**

Hello! I'm your advanced AI Study Assistant, powered by cutting-edge artificial intelligence to provide you with comprehensive educational support across all subjects and learning levels.

🧠 **My Advanced Capabilities:**
• Deep analysis and insights on any academic topic
• Personalized study plans tailored to your learning style
• Comprehensive resource recommendations and research assistance
• Advanced problem-solving with multiple solution approaches
• Real-time learning adaptation based on your progress
• Cross-subject connections and interdisciplinary insights

🚀 **Ready to learn?** I can help you with any subject, from basic concepts to advanced research. Just ask me anything!

What would you like to explore or learn about today?`
      }
      
      setMessages([{ 
        id: "1", 
        role: "ai", 
        content: modeMessages[mode as keyof typeof modeMessages] || modeMessages.assistant 
      }])
    }
    
    initializeChat()
  }, [mode])

  // Function to create study session with extracted topic
  const createStudySessionWithTopic = async (topic: string) => {
    if (user && !sessionCreated) {
        try {
          const session = await apiClient.createStudySession({
          topic: topic,
            mode: mode as 'beginner' | 'practice' | 'exam',
          notes: `Started ${mode} mode study session on ${topic}`
          })
          setCurrentSession(session)
          setSessionId(session.id.toString())
        setSessionCreated(true)
        } catch (error) {
          console.error('Failed to create study session:', error)
        }
      }
    }

  const onSend = async (text: string) => {
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((m) => [...m, userMsg])
    setTyping(true)
    
    // Extract topic and create session if this is the first user message
    if (messages.filter(m => m.role === 'user').length === 0) {
      const extractedTopic = extractTopicFromMessage(text)
      setSessionTopic(extractedTopic)
      
      // Create study session with the extracted topic
      await createStudySessionWithTopic(extractedTopic)
    }
    
    try {
      // Send message to AI agent with mode-specific context
      const modeContext = {
        beginner: "You are in BEGINNER MODE. Use simple language and provide basic explanations with everyday examples.",
        practice: "You are in PRACTICE MODE. Create interactive exercises with hints and step-by-step solutions.",
        exam: "You are in EXAM MODE. Provide timed assessments with results and comprehensive review.",
        assistant: "You are an ADVANCED AI ASSISTANT. Provide comprehensive, intelligent responses with deep analysis, multiple perspectives, and advanced insights. Adapt your communication style to the user's level while maintaining professional expertise."
      }
      
      const response = await apiClient.chatWithAgent({
        message: `${modeContext[mode as keyof typeof modeContext]}\n\nUser Question: ${text}`,
        session_id: sessionId || undefined,
        mode: mode, // Pass mode as direct parameter for orchestration
        context: {
          mode: mode,
          topic: sessionTopic,
          user_id: user?.id,
          study_mode_context: modeContext[mode as keyof typeof modeContext]
        }
      })
      
      
      // Check if response has the expected structure
      if (response && response.response) {
        // Update session ID if provided in response
        if (response.session_id && response.session_id !== sessionId) {
          setSessionId(response.session_id)
        }
        
        const aiMsg: Msg = {
          id: crypto.randomUUID(),
          role: "ai",
          content: response.response
        }
        setMessages((m) => [...m, aiMsg])
      } else {
        throw new Error('Invalid response format from AI agent')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: Msg = {
        id: crypto.randomUUID(),
        role: "ai",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
      }
      setMessages((m) => [...m, errorMsg])
    } finally {
      setTyping(false)
      scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" })
    }
  }

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight })
  }, [])

  // Cleanup: End session when component unmounts
  React.useEffect(() => {
    return () => {
      if (currentSession && sessionId) {
        // End the session when leaving the page
        apiClient.updateStudySession(sessionId, {
          end_time: new Date().toISOString(),
          duration_minutes: Math.floor((Date.now() - new Date(currentSession.start_time).getTime()) / 60000),
          notes: `Ended ${mode} mode study session`
        }).catch(console.error)
      }
    }
  }, [currentSession, sessionId, mode])

  const getModeDisplayName = (mode: string) => {
    const modeNames = {
      beginner: "Beginner Mode",
      practice: "Practice Mode", 
      exam: "Exam Mode",
      assistant: "AI Assistant"
    }
    return modeNames[mode as keyof typeof modeNames] || "AI Assistant"
  }

  const startNewSession = async () => {
    try {
      // Clear current messages
      setMessages([])
      
      // Create new session
      const session = await apiClient.createStudySession({
        topic: "AI Assistant Chat",
        mode: mode as 'beginner' | 'practice' | 'exam',
        notes: `Started new ${mode} mode session`
      })
      
      setCurrentSession(session)
      setSessionId(session.id.toString())
      
      // Initialize with welcome message
      const welcomeMessage = {
        id: crypto.randomUUID(),
        role: "ai" as const,
        content: "New session started! I'm ready to help you with your educational questions. What would you like to learn about?"
      }
      setMessages([welcomeMessage])
      
      setShowSessionOptions(false)
    } catch (error) {
      console.error('Failed to start new session:', error)
    }
  }

  const continueCurrentSession = () => {
    setShowSessionOptions(false)
  }


  console.log("test the response from the ai agent", messages)


  const theme = modeThemes[mode as keyof typeof modeThemes] || modeThemes.beginner

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Mode-specific header */}
      <ModeHeader mode={mode} />
      
      {/* Session info bar */}
      <div className="bg-card/50 border-b border-border px-4 py-2">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {getModeDisplayName(mode)}
            </span>
            {sessionId && (
              <span className="text-xs text-muted-foreground">
                Session #{sessionId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSessionOptions(!showSessionOptions)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Session Options
            </button>
          <div className="text-xs text-muted-foreground">
            {user?.full_name || user?.username}
          </div>
        </div>
      </div>

        {/* Session Options Dropdown */}
        {showSessionOptions && (
          <div className="mx-auto max-w-3xl mt-2 p-3 bg-card border border-border rounded-lg shadow-sm">
            <div className="space-y-2">
              <button
                onClick={startNewSession}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
              >
                Start New Session
              </button>
              <button
                onClick={continueCurrentSession}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
              >
                Continue Current Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat messages area */}
      <div ref={scrollerRef} className="mx-auto mt-6 w-full max-w-3xl flex-1 overflow-y-auto px-4 pb-32 bg-background">
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <ModeMessageBubble key={m.id} role={m.role} mode={mode}>
              {m.content}
            </ModeMessageBubble>
          ))}
          {typing && <ModeTypingIndicator mode={mode} />}
        </div>
      </div>

      {/* Quick actions */}
      <ModeQuickActions 
        mode={mode} 
        onAction={(action) => onSend(action)} 
      />

      {/* Input area */}
      <ModeInputArea mode={mode} />
      
      {/* Chat input */}
      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <StudyLoader 
          size="xl" 
          variant="detailed" 
          text="Initializing your AI study assistant..."
        />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
