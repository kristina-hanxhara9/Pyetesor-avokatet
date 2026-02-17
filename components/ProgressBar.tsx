import { TOTAL_QUESTIONS } from '../constants'

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const percent = ((currentStep + 1) / TOTAL_QUESTIONS) * 100

  return (
    <div className="w-full px-4 py-3 bg-white border-b border-gray-100">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-sans font-medium text-navy">
            Pyetja {currentStep + 1} nga {TOTAL_QUESTIONS}
          </span>
          <span className="text-xs font-sans text-gray-400">
            {Math.round(percent)}% e plotësuar
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${i < currentStep
                  ? 'bg-navy'
                  : i === currentStep
                  ? 'bg-gold ring-2 ring-gold/30 w-2.5 h-2.5'
                  : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
