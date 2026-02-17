import { ChevronLeft, ChevronRight, Send, SkipForward } from 'lucide-react'

interface NavigationButtonsProps {
  onBack: () => void
  onNext: () => void
  onSkip: () => void
  onSubmit: () => void
  canGoBack: boolean
  canGoNext: boolean
  isLastStep: boolean
  isSubmitting: boolean
}

export function NavigationButtons({
  onBack,
  onNext,
  onSkip,
  onSubmit,
  canGoBack,
  canGoNext,
  isLastStep,
  isSubmitting,
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-pb">
      <div className="max-w-xl mx-auto flex items-center gap-3">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="
            flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-2 border-gray-200
            font-sans text-sm font-medium text-gray-600
            hover:border-gray-300 hover:text-gray-800
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all duration-150
          "
        >
          <ChevronLeft size={16} />
          Kthehu
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Skip button (subtle) */}
        {!canGoNext && !isLastStep && (
          <button
            type="button"
            onClick={onSkip}
            className="
              flex items-center gap-1 px-3 py-2.5 rounded-lg
              font-sans text-xs font-medium text-gray-400 hover:text-gray-600
              transition-colors duration-150
            "
          >
            <SkipForward size={14} />
            Kalo
          </button>
        )}

        {/* Next / Submit button */}
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="
              flex items-center gap-2 px-6 py-2.5 rounded-lg
              bg-gold hover:bg-gold-dark text-white font-sans text-sm font-semibold
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-150 shadow-sm
            "
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Duke dërguar...
              </span>
            ) : (
              <>
                <Send size={15} />
                Dërgo Pyetësorin
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="
              flex items-center gap-2 px-6 py-2.5 rounded-lg
              bg-navy hover:bg-navy-light text-white font-sans text-sm font-semibold
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150 shadow-sm
            "
          >
            Vazhdo
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
