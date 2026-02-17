import { Mail } from 'lucide-react'

interface EmailInputProps {
  value: string
  onChange: (val: string) => void
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3 mt-4">
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-navy flex-shrink-0" />
        <h3 className="font-serif text-sm font-semibold text-navy">
          Email-i juaj <span className="text-gray-400 font-sans font-normal">(opsional)</span>
        </h3>
      </div>
      <p className="font-sans text-xs text-gray-500 leading-relaxed">
        Nëse dëshironi të merrni rezultatet ose të informoheni rreth projektit, lini email-in tuaj.
      </p>
      <input
        type="email"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="avokat@shembull.al"
        className="
          w-full px-4 py-3 rounded-lg border-2 border-gray-200
          font-sans text-sm text-[#1a1a2e]
          focus:outline-none focus:border-navy
          placeholder-gray-300
          transition-colors duration-150
        "
      />
    </div>
  )
}
