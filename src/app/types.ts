export type Stage = 0 | 1 | 2 | 3 | 4 | 5
export type View = 'warroom' | 'subjects' | 'chat' | 'homework' | 'wronganswers'
export type QuizMode = 'typed' | 'multiple-choice' | 'essay'

export interface Question {
  q: string
  hint?: string
  options?: string[]
  correctIndex?: number
}

export interface AnswerResult {
  correct: boolean
  feedback: string
  score_label: string
  correct_answer?: string
}

export interface MarkingResult {
  results: AnswerResult[]
  total_correct: number
  weak_areas: string
  overall_comment: string
}

export interface Flashcard {
  front: string
  back: string
}

export interface PlanBlock {
  time: string
  activity: string
}

export interface RevisionPlan {
  plan: PlanBlock[]
  next_topic: string
  next_reason: string
}

export interface AppState {
  topic: string
  subject: string
  mode: QuizMode
  questions: Question[]
  answers: string[]
  markingResult: MarkingResult | null
  flashcards: Flashcard[]
  revisionPlan: RevisionPlan | null
  essayPrompts: EssayPrompt[]
  stage: Stage
}

export interface EssayPrompt {
  prompt: string
  markScheme: string
  wordCount: string
}

export interface EssayAnswer {
  promptIndex: number
  answer: string
  feedback: string
  grade: string
}

export interface StudySession {
  id: string
  topic: string
  subject: string
  date: string
  score: number
  totalQuestions: number
  mode: QuizMode
  questions: Question[]
  markingResult: MarkingResult | null
  flashcards: Flashcard[]
  nextReviewDate?: string
}

export interface WrongAnswer {
  id: string
  topic: string
  subject: string
  question: string
  yourAnswer: string
  correctAnswer: string
  date: string
  drilled: boolean
}

export interface HomeworkItem {
  id: string
  title: string
  subject: string
  dueDate: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  isExam?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface StudyStreak {
  count: number
  lastDate: string
}
