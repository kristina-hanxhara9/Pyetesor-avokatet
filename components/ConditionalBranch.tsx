import type { SubQuestion } from '../types'
import { CheckboxGroup } from './CheckboxGroup'
import { RadioGroup } from './RadioGroup'
import { TjetreInput } from './TjetreInput'

interface ConditionalBranchProps {
  subQuestion: SubQuestion
  parentSelected: string[]
  subAnswer: string[]
  tjetreText: string
  onSubAnswerChange: (vals: string[]) => void
  onTjetreChange: (text: string) => void
}

export function ConditionalBranch({
  subQuestion,
  parentSelected,
  subAnswer,
  tjetreText,
  onSubAnswerChange,
  onTjetreChange,
}: ConditionalBranchProps) {
  const isVisible = parentSelected.includes(subQuestion.triggerValue)
  const hasTjetre = subQuestion.options.some(o => o.isTjetreOption)
  const tjetreSelected = hasTjetre && subAnswer.some(v =>
    subQuestion.options.find(o => o.value === v)?.isTjetreOption
  )

  const handleRadioChange = (val: string) => {
    onSubAnswerChange([val])
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-350 ${
        isVisible ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
      }`}
      style={{ transition: 'max-height 0.35s ease, opacity 0.25s ease' }}
    >
      <div className="pl-4 border-l-2 border-gold/40 space-y-3">
        <p className="font-serif text-sm text-navy font-medium">{subQuestion.label}</p>
        {subQuestion.type === 'radio' ? (
          <RadioGroup
            options={subQuestion.options}
            selected={subAnswer[0] ?? ''}
            onChange={handleRadioChange}
          />
        ) : (
          <CheckboxGroup
            options={subQuestion.options}
            selected={subAnswer}
            onChange={onSubAnswerChange}
          />
        )}
        {hasTjetre && (
          <TjetreInput
            value={tjetreText}
            onChange={onTjetreChange}
            visible={!!tjetreSelected}
          />
        )}
      </div>
    </div>
  )
}
