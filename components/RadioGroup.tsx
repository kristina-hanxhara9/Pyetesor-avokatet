import type { QuestionOption } from '../types'

interface RadioGroupProps {
  options: QuestionOption[]
  selected: string
  onChange: (value: string) => void
}

export function RadioGroup({ options, selected, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map(option => {
        const isSelected = selected === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left
              transition-all duration-150 min-h-[48px]
              ${isSelected
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 bg-white text-[#1a1a2e] hover:border-navy/40 hover:bg-navy/5'
              }
            `}
          >
            <span
              className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                transition-colors duration-150
                ${isSelected ? 'border-white' : 'border-gray-300'}
              `}
            >
              {isSelected && (
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
              )}
            </span>
            <span className="font-sans text-sm font-medium leading-snug">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
