import { Check } from 'lucide-react'
import type { QuestionOption } from '../types'

interface CheckboxGroupProps {
  options: QuestionOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-2">
      {options.map(option => {
        const isChecked = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left
              transition-all duration-150 min-h-[48px]
              ${isChecked
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 bg-white text-[#1a1a2e] hover:border-navy/40 hover:bg-navy/5'
              }
            `}
          >
            <span
              className={`
                flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                transition-colors duration-150
                ${isChecked ? 'border-white bg-white' : 'border-gray-300'}
              `}
            >
              {isChecked && <Check size={13} className="text-navy stroke-[3]" />}
            </span>
            <span className="font-sans text-sm font-medium leading-snug">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
