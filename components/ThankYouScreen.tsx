import { CheckCircle, Download, RotateCcw, Loader2, Mic } from 'lucide-react'
import type { QuestionAnswer, QuestionnaireSubmission } from '../types'
import { QUESTIONS } from '../constants'

interface ThankYouScreenProps {
  submission: QuestionnaireSubmission
  voiceAnswers: QuestionAnswer[]
  isSubmitting: boolean
  submitError: string | null
  onRetrySubmit: () => void
  onDownloadJSON: () => void
  onReset: () => void
}

function downloadVoice(blob: Blob, questionId: number) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pyetesor-zeri-pyetja-${questionId}-${Date.now()}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatDuration(sec?: number) {
  if (!sec) return ''
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ThankYouScreen({
  submission,
  voiceAnswers,
  isSubmitting,
  submitError,
  onRetrySubmit,
  onDownloadJSON,
  onReset,
}: ThankYouScreenProps) {
  const voiceRecordings = voiceAnswers.filter(a => a.voiceBlob)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-navy px-6 py-10 text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle size={36} className="text-green-400" />
          </div>
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2">Faleminderit!</h1>
        <p className="font-sans text-white/70 text-sm max-w-xs mx-auto">
          Përgjigjet tuaja u regjistruan me sukses.
        </p>
        {submission.respondentEmail && (
          <p className="font-sans text-white/50 text-xs mt-1">
            {submission.respondentEmail}
          </p>
        )}
      </div>

      <div className="flex-1 px-5 py-6 max-w-xl mx-auto w-full space-y-5">

        {/* Submission status */}
        {isSubmitting && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Loader2 size={18} className="text-blue-500 animate-spin flex-shrink-0" />
            <p className="font-sans text-sm text-blue-700">Duke dërguar përgjigjet me email...</p>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
            <p className="font-sans text-sm text-red-700 font-medium">
              Emaili nuk u dërgua. Ju lutem shkarkoni përgjigjet manualisht.
            </p>
            <p className="font-sans text-xs text-red-500">{submitError}</p>
            <button
              type="button"
              onClick={onRetrySubmit}
              className="text-xs text-red-600 underline font-sans"
            >
              Provoni sërish
            </button>
          </div>
        )}

        {/* Voice recordings */}
        {voiceRecordings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Mic size={14} className="text-navy" />
              <h2 className="font-serif text-sm font-semibold text-navy">
                Regjistrime zanore ({voiceRecordings.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {voiceRecordings.map(ans => {
                const q = QUESTIONS.find(q => q.id === ans.questionId)
                const cloudUrl = submission.answers.find(a => a.questionId === ans.questionId)?.cloudinaryUrl
                return (
                  <div key={ans.questionId} className="px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-sans text-xs text-gray-500 truncate">
                          {q?.emoji} Pyetja {ans.questionId}
                        </p>
                        {ans.voiceDurationSec && (
                          <p className="font-sans text-xs text-gray-400 tabular-nums">
                            {formatDuration(ans.voiceDurationSec)}
                            {cloudUrl && <span className="ml-2 text-green-600">✓ ngarkuar</span>}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadVoice(ans.voiceBlob!, ans.questionId)}
                        className="
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                          border border-gray-200 text-gray-600 text-xs font-sans
                          hover:bg-gray-50 transition-colors flex-shrink-0
                        "
                      >
                        <Download size={12} />
                        Shkarko
                      </button>
                    </div>
                    {/* Inline player — Cloudinary URL if uploaded, otherwise local blob */}
                    <audio
                      src={cloudUrl ?? (ans.voiceBlob ? URL.createObjectURL(ans.voiceBlob) : undefined)}
                      controls
                      className="w-full h-8"
                      style={{ accentColor: '#1e3a5f' }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="font-sans text-xs text-gray-400">
                Regjistrimet u ngarkuan në cloud — mund t'i dëgjoni edhe nga emaili.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onDownloadJSON}
            className="
              w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
              border-2 border-navy text-navy
              font-sans font-semibold text-sm
              hover:bg-navy hover:text-white
              transition-all duration-150
            "
          >
            <Download size={16} />
            Shkarko Përgjigjet (JSON)
          </button>

          <button
            type="button"
            onClick={onReset}
            className="
              w-full flex items-center justify-center gap-2 py-3 rounded-xl
              text-gray-500 font-sans text-sm
              hover:text-gray-700
              transition-colors duration-150
            "
          >
            <RotateCcw size={14} />
            Fillo Pyetësorin Sërish
          </button>
        </div>

        {/* Answer summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="font-serif text-sm font-semibold text-navy">Përmbledhje e përgjigjeve</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {submission.answers.map((ans, i) => (
              <div key={ans.questionId} className="px-4 py-3 space-y-1">
                <p className="font-sans text-xs text-gray-500 leading-snug">
                  {QUESTIONS[i].emoji} {QUESTIONS[i].text}
                </p>
                {ans.selectedOptions.length > 0 ? (
                  <p className="font-sans text-xs font-medium text-[#1a1a2e] leading-snug">
                    {ans.selectedOptions.join(', ')}
                    {ans.subAnswer.length > 0 && ` → ${ans.subAnswer.join(', ')}`}
                    {ans.tjetreText && ` (${ans.tjetreText})`}
                    {ans.voiceDurationSec ? (
                      <span className="ml-1 text-green-600">+ 🎙 {formatDuration(ans.voiceDurationSec)}</span>
                    ) : null}
                  </p>
                ) : ans.voiceDurationSec ? (
                  <p className="font-sans text-xs text-green-600 font-medium">
                    🎙 Regjistrim zanor ({formatDuration(ans.voiceDurationSec)})
                  </p>
                ) : (
                  <p className="font-sans text-xs text-gray-400 italic">Kaluar</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
