import { useState, useCallback } from 'react'
import type { AppState, QuestionAnswer, QuestionnaireSubmission } from './types'
import { QUESTIONS, SUBMISSION_EMAIL } from './constants'
import { useQuestionnaire } from './hooks/useQuestionnaire'
import { WelcomeScreen } from './components/WelcomeScreen'
import { ThankYouScreen } from './components/ThankYouScreen'
import { ProgressBar } from './components/ProgressBar'
import { QuestionCard } from './components/QuestionCard'
import { NavigationButtons } from './components/NavigationButtons'
import { EmailInput } from './components/EmailInput'

function downloadJSON(submission: QuestionnaireSubmission) {
  const json = JSON.stringify(submission, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pyetesor-avokat-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function submitViaFormSubmit(submission: QuestionnaireSubmission): Promise<void> {
  const formData = new FormData()
  formData.append('_subject', 'Pyetësor për Avokatë — Përgjigje e re')
  formData.append('_captcha', 'false')
  formData.append('_template', 'table')
  formData.append('submittedAt', submission.submittedAt)
  if (submission.respondentEmail) {
    formData.append('Email_i_Avokatit', submission.respondentEmail)
  }

  submission.answers.forEach((ans, i) => {
    const key = `Pyetja_${i + 1}`
    const val = [
      ans.selectedOptions.join(', '),
      ans.subAnswer.length > 0 ? `(${ans.subAnswer.join(', ')})` : '',
      ans.tjetreText ? `Tjetër: ${ans.tjetreText}` : '',
      ans.voiceDurationSec ? `[Zë: ${ans.voiceDurationSec}s]` : '',
    ]
      .filter(Boolean)
      .join(' ')
    formData.append(key, val || '(kaluar)')
  })

  const response = await fetch(`https://formsubmit.co/${SUBMISSION_EMAIL}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`FormSubmit error: ${response.status}`)
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome')
  const [submission, setSubmission] = useState<QuestionnaireSubmission | null>(null)
  const [submittedAnswers, setSubmittedAnswers] = useState<QuestionAnswer[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [respondentEmail, setRespondentEmail] = useState('')

  const {
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
  } = useQuestionnaire()

  const currentQuestion = QUESTIONS[currentStep]
  const currentAnswer = answers[currentStep]

  const handleStart = () => {
    discardDraft()
    setAppState('questionnaire')
  }

  const handleResume = () => {
    resumeDraft()
    setAppState('questionnaire')
  }

  const handleDiscard = () => {
    discardDraft()
    setAppState('questionnaire')
  }

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    const sub = buildSubmission(respondentEmail)
    setSubmission(sub)
    setSubmittedAnswers([...answers])
    setAppState('thankyou')

    try {
      await submitViaFormSubmit(sub)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gabim i panjohur')
    } finally {
      setIsSubmitting(false)
    }
  }, [buildSubmission, respondentEmail, answers])

  const handleRetrySubmit = useCallback(async () => {
    if (!submission) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await submitViaFormSubmit(submission)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gabim i panjohur')
    } finally {
      setIsSubmitting(false)
    }
  }, [submission])

  const handleDownloadJSON = useCallback(() => {
    if (submission) downloadJSON(submission)
  }, [submission])

  const handleReset = () => {
    reset()
    setSubmission(null)
    setSubmittedAnswers([])
    setSubmitError(null)
    setRespondentEmail('')
    setAppState('welcome')
  }

  if (appState === 'welcome') {
    return (
      <WelcomeScreen
        hasDraft={hasDraft}
        onStart={handleStart}
        onResume={handleResume}
        onDiscard={handleDiscard}
      />
    )
  }

  if (appState === 'thankyou' && submission) {
    return (
      <ThankYouScreen
        submission={submission}
        voiceAnswers={submittedAnswers}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onRetrySubmit={handleRetrySubmit}
        onDownloadJSON={handleDownloadJSON}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <h1 className="font-serif text-navy text-sm font-semibold">Pyetësor për Avokatë</h1>
          </div>
          <ProgressBar currentStep={currentStep} />
        </div>
      </header>

      {/* Scrollable question area */}
      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28">
        <div className="max-w-xl mx-auto">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={update => setAnswer(currentQuestion.id, update)}
          />

          {isLastStep && (
            <EmailInput
              value={respondentEmail}
              onChange={setRespondentEmail}
            />
          )}

          {!canGoNext && (
            <p className="text-center text-xs text-gray-400 font-sans mt-3">
              Zgjidhni të paktën një opsion ose regjistroni një përgjigje me zë për të vazhduar.
            </p>
          )}
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <NavigationButtons
        onBack={goBack}
        onNext={goNext}
        onSkip={skip}
        onSubmit={handleSubmit}
        canGoBack={currentStep > 0}
        canGoNext={canGoNext}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
