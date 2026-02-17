import { useState, useCallback, useEffect } from 'react'
import type { QuestionAnswer, QuestionnaireSubmission, SerializedAnswer } from '../types'
import { QUESTIONS, DRAFT_KEY, TOTAL_QUESTIONS } from '../constants'

function makeEmptyAnswer(questionId: number): QuestionAnswer {
  return {
    questionId,
    selectedOptions: [],
    subAnswer: [],
    tjetreText: '',
    voiceBlob: undefined,
    voiceDurationSec: undefined,
  }
}

function makeInitialAnswers(): QuestionAnswer[] {
  return QUESTIONS.map(q => makeEmptyAnswer(q.id))
}

function isStepValid(answer: QuestionAnswer): boolean {
  return answer.selectedOptions.length > 0 || answer.voiceBlob !== undefined
}

function saveDraft(step: number, answers: QuestionAnswer[]) {
  try {
    const serializable = answers.map(a => ({
      ...a,
      voiceBlob: undefined,
      voiceDurationSec: a.voiceDurationSec,
    }))
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers: serializable }))
  } catch {
    // ignore storage errors
  }
}

function loadDraft(): { step: number; answers: QuestionAnswer[] } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { step: number; answers: QuestionAnswer[] }
    if (
      typeof parsed.step !== 'number' ||
      !Array.isArray(parsed.answers) ||
      parsed.answers.length !== TOTAL_QUESTIONS
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export interface UseQuestionnaireReturn {
  currentStep: number
  answers: QuestionAnswer[]
  hasDraft: boolean
  resumeDraft: () => void
  discardDraft: () => void
  setAnswer: (questionId: number, update: Partial<QuestionAnswer>) => void
  goNext: () => void
  goBack: () => void
  skip: () => void
  canGoNext: boolean
  isLastStep: boolean
  buildSubmission: (respondentEmail: string) => QuestionnaireSubmission
  reset: () => void
}

export function useQuestionnaire(): UseQuestionnaireReturn {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuestionAnswer[]>(makeInitialAnswers)
  const [hasDraft, setHasDraft] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)

  useEffect(() => {
    if (!draftLoaded) {
      const draft = loadDraft()
      if (draft) {
        setHasDraft(true)
      }
      setDraftLoaded(true)
    }
  }, [draftLoaded])

  useEffect(() => {
    if (draftLoaded && !hasDraft) {
      saveDraft(currentStep, answers)
    }
  }, [currentStep, answers, draftLoaded, hasDraft])

  const resumeDraft = useCallback(() => {
    const draft = loadDraft()
    if (draft) {
      setAnswers(draft.answers)
      setCurrentStep(draft.step)
    }
    setHasDraft(false)
  }, [])

  const discardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setHasDraft(false)
  }, [])

  const setAnswer = useCallback((questionId: number, update: Partial<QuestionAnswer>) => {
    setAnswers(prev =>
      prev.map(a => (a.questionId === questionId ? { ...a, ...update } : a))
    )
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, TOTAL_QUESTIONS - 1))
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0))
  }, [])

  const skip = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, TOTAL_QUESTIONS - 1))
  }, [])

  const currentAnswer = answers[currentStep]
  const canGoNext = isStepValid(currentAnswer)
  const isLastStep = currentStep === TOTAL_QUESTIONS - 1

  const buildSubmission = useCallback((respondentEmail: string): QuestionnaireSubmission => {
    const serialized: SerializedAnswer[] = answers.map((a, i) => ({
      questionId: a.questionId,
      questionText: QUESTIONS[i].text,
      selectedOptions: a.selectedOptions,
      subAnswer: a.subAnswer,
      tjetreText: a.tjetreText,
      voiceDurationSec: a.voiceDurationSec,
    }))
    return {
      submittedAt: new Date().toISOString(),
      respondentEmail,
      answers: serialized,
    }
  }, [answers])

  const reset = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY)
    setAnswers(makeInitialAnswers())
    setCurrentStep(0)
    setHasDraft(false)
  }, [])

  return {
    currentStep,
    answers,
    hasDraft,
    resumeDraft,
    discardDraft,
    setAnswer,
    goNext,
    goBack,
    skip,
    canGoNext,
    isLastStep,
    buildSubmission,
    reset,
  }
}
