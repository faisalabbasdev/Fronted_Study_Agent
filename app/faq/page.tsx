import { BookOpen, FileText, Target } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SiteFooter from "@/components/site-footer"

const questions = [
  {
    label: "MATERIALS & QUIZZES",
    icon: FileText,
    items: [
      { question: "How does a material-based quiz work?", answer: "Add a PDF to a subject in your dashboard. Tayyar extracts and organizes its text, then uses relevant passages to create practice questions. When a source location is available, the question includes the material and page so you can check it." },
      { question: "Which files can I upload?", answer: "The current study-material workflow supports PDF lecture notes, books, slides, and past papers. Other file types are not part of this version." },
      { question: "Can I practice a specific topic?", answer: "Yes. Choose topic practice, select a weak topic, or use the topics identified from an analyzed past paper. Question availability depends on the text in your uploaded materials." },
    ],
  },
  {
    label: "PERSONALIZED PRACTICE",
    icon: Target,
    items: [
      { question: "What does Practice Mastery mean?", answer: "It is an estimate based on your saved quiz answers and topic performance. It helps you decide what to revisit; it is not a precise measurement of knowledge or a prediction of exam marks." },
      { question: "How does Tayyar choose what I should study today?", answer: "The recommendation logic considers topic performance, recent incorrect answers, review timing, your exam date, and which study materials are available. It uses your saved practice history rather than choosing topics at random." },
      { question: "Does Mistake Practice repeat the same question?", answer: "It targets the topic or concept behind saved incorrect answers and asks for fresh practice. It is intended to check whether you can apply the idea again, rather than memorize one question." },
    ],
  },
  {
    label: "YOUR STUDY SPACE",
    icon: BookOpen,
    items: [
      { question: "Can I use Tayyar at different universities?", answer: "Yes. University, program, semester, and subject details belong to your student profile and subjects; the platform is not limited to one university." },
      { question: "Can I add an exam date later?", answer: "Yes. Add or change the exam date from the subject card. It is used for countdowns and practice recommendations, not to predict your result." },
      { question: "How do I see why an answer was marked wrong?", answer: "Open the quiz review or Mistake Book to see your answer, the correct answer, and the explanation saved with that question. Material-grounded questions can also show their source reference." },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="tayyar-faq-page tayyar-subpage">
      <section className="tayyar-faq-layout">
        <div className="tayyar-faq-intro">
          <p className="tayyar-mini-label"><span /> FAQ</p>
          <h1>Quick<br /><span>answers.</span></h1>
          <p>Questions about your materials, practice history, and what Tayyar uses to guide your next study session.</p>
        </div>
        <div className="tayyar-faq-groups">
          {questions.map((group, groupIndex) => {
            const Icon = group.icon
            return <section key={group.label} className="tayyar-faq-group">
              <p className="tayyar-faq-group-label"><Icon />{group.label}</p>
              <Accordion type="single" collapsible className="tayyar-faq-accordion">
                {group.items.map((item, itemIndex) => <AccordionItem key={item.question} value={`${groupIndex}-${itemIndex}`} className="tayyar-faq-item">
                  <AccordionTrigger className="tayyar-faq-trigger">{item.question}</AccordionTrigger>
                  <AccordionContent className="tayyar-faq-answer">{item.answer}</AccordionContent>
                </AccordionItem>)}
              </Accordion>
            </section>
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
