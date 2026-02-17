export interface QuestionOption {
  value: string
  label: string
  isTjetreOption?: boolean
}

export interface SubQuestion {
  label: string
  type: 'radio' | 'checkbox'
  triggerValue: string
  options: QuestionOption[]
}

export interface Question {
  id: number
  emoji: string
  text: string
  type: 'checkbox' | 'radio'
  options: QuestionOption[]
  subQuestion?: SubQuestion
  allowVoice: true
}

export interface QuestionAnswer {
  questionId: number
  selectedOptions: string[]
  subAnswer: string[]
  tjetreText: string
  voiceBlob?: Blob
  voiceDurationSec?: number
}

export interface QuestionnaireSubmission {
  submittedAt: string
  respondentEmail: string
  answers: SerializedAnswer[]
}

export interface SerializedAnswer {
  questionId: number
  questionText: string
  selectedOptions: string[]
  subAnswer: string[]
  tjetreText: string
  voiceDurationSec?: number
  cloudinaryUrl?: string
}

export type AppState = 'welcome' | 'questionnaire' | 'thankyou'
