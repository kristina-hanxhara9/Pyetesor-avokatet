import { useEffect, useRef } from 'react'

interface TjetreInputProps {
  value: string
  onChange: (value: string) => void
  visible: boolean
}

export function TjetreInput({ value, onChange, visible }: TjetreInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (visible && ref.current) {
      setTimeout(() => {
        ref.current?.focus()
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 350)
    }
  }, [visible])

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        visible ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
      }`}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Ju lutem specifikoni..."
        rows={3}
        className="
          w-full px-4 py-3 rounded-lg border-2 border-gold/60 bg-white
          font-sans text-sm text-[#1a1a2e] resize-none
          focus:outline-none focus:border-gold placeholder-gray-400
          transition-colors duration-150
        "
      />
    </div>
  )
}
