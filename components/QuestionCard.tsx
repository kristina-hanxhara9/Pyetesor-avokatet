import type { Question, QuestionAnswer } from '../types'
import { CheckboxGroup } from './CheckboxGroup'
import { RadioGroup } from './RadioGroup'
import { TjetreInput } from './TjetreInput'
import { ConditionalBranch } from './ConditionalBranch'
import { VoiceRecorder } from './VoiceRecorder'

interface QuestionCardProps {
  question: Question
  answer: QuestionAnswer
  onAnswerChange: (update: Partial<QuestionAnswer>) => void
}

export function QuestionCard({ question, answer, onAnswerChange }: QuestionCardProps) {
  const hasTjetre = question.options.some(o => o.isTjetreOption)
  const tjetreSelected = hasTjetre && answer.selectedOptions.some(v =>
    question.options.find(o => o.value === v)?.isTjetreOption
  )

  const handleCheckboxChange = (selected: string[]) => {
    onAnswerChange({ selectedOptions: selected })
  }

  const handleRadioChange = (value: string) => {
    // When parent radio changes, clear sub-answer if trigger no longer matches
    const newOptions = [value]
    const subQ = question.subQuestion
    if (subQ && !newOptions.includes(subQ.triggerValue)) {
      onAnswerChange({ selectedOptions: newOptions, subAnswer: [] })
    } else {
      onAnswerChange({ selectedOptions: newOptions })
    }
  }

  const handleSubAnswerChange = (vals: string[]) => {
    onAnswerChange({ subAnswer: vals })
  }

  const handleTjetreChange = (text: string) => {
    onAnswerChange({ tjetreText: text })
  }

  const handleRecordingChange = (blob: Blob | null, durationSec?: number) => {
    onAnswerChange({
      voiceBlob: blob ?? undefined,
      voiceDurationSec: blob ? durationSec : undefined,
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Question header */}
      <div className="space-y-1">
        <span className="text-2xl">{question.emoji}</span>
        <h2 className="font-serif text-[#1a1a2e] text-base leading-snug font-semibold">
          {question.text}
        </h2>
      </div>

      {/* Options */}
      {question.type === 'checkbox' ? (
        <CheckboxGroup
          options={question.options.filter(o => !o.isTjetreOption)}
          selected={answer.selectedOptions}
          onChange={handleCheckboxChange}
        />
      ) : (
        <RadioGroup
          options={question.options}
          selected={answer.selectedOptions[0] ?? ''}
          onChange={handleRadioChange}
        />
      )}

      {/* "Tjetër" checkbox for checkbox-type questions */}
      {question.type === 'checkbox' && hasTjetre && (
        <div>
          {question.options
            .filter(o => o.isTjetreOption)
            .map(option => {
              const isChecked = answer.selectedOptions.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    const newSelected = isChecked
                      ? answer.selectedOptions.filter(v => v !== option.value)
                      : [...answer.selectedOptions, option.value]
                    onAnswerChange({ selectedOptions: newSelected, tjetreText: isChecked ? '' : answer.tjetreText })
                  }}
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
                    {isChecked && (
                      <svg viewBox="0 0 13 13" className="w-3 h-3 text-navy" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="1.5,6.5 5,10 11.5,2.5" />
                      </svg>
                    )}
                  </span>
                  <span className="font-sans text-sm font-medium">{option.label}</span>
                </button>
              )
            })}
          <TjetreInput
            value={answer.tjetreText}
            onChange={handleTjetreChange}
            visible={tjetreSelected}
          />
        </div>
      )}

      {/* Conditional sub-question (Q7, Q9) */}
      {question.subQuestion && (
        <ConditionalBranch
          subQuestion={question.subQuestion}
          parentSelected={answer.selectedOptions}
          subAnswer={answer.subAnswer}
          tjetreText={answer.tjetreText}
          onSubAnswerChange={handleSubAnswerChange}
          onTjetreChange={handleTjetreChange}
        />
      )}

      {/* Voice recorder */}
      <VoiceRecorder onRecordingChange={handleRecordingChange} />
    </div>
  )
}
