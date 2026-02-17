import { Scale, Clock, Mic, ChevronRight, AlertCircle } from 'lucide-react'

interface WelcomeScreenProps {
  hasDraft: boolean
  onStart: () => void
  onResume: () => void
  onDiscard: () => void
}

export function WelcomeScreen({ hasDraft, onStart, onResume, onDiscard }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-navy px-6 py-8 text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center border-2 border-gold/40">
            <Scale size={30} className="text-gold" />
          </div>
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2 tracking-tight">
          Pyetësor për Avokatë
        </h1>
        <p className="font-sans text-navy-light text-sm text-white/70 max-w-sm mx-auto">
          Hulumtim mbi praktikat dhe sfidat e punës ligjore ditore
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 max-w-xl mx-auto w-full space-y-5">

        {/* Draft resume banner */}
        {hasDraft && (
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-[#1a1a2e]">
                  Keni një pyetësor të paplotësuar
                </p>
                <p className="font-sans text-xs text-gray-600 mt-0.5">
                  Dëshironi të vazhdoni nga ku e latë?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onResume}
                className="flex-1 py-2 rounded-lg bg-navy text-white text-sm font-sans font-medium hover:bg-navy-light transition-colors"
              >
                Vazhdo
              </button>
              <button
                type="button"
                onClick={onDiscard}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-sans hover:bg-gray-50 transition-colors"
              >
                Fillo sërish
              </button>
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <Clock size={20} className="text-navy mx-auto mb-2" />
            <p className="font-sans text-xs text-gray-500">Kohëzgjatja</p>
            <p className="font-sans text-sm font-semibold text-[#1a1a2e] mt-0.5">5–10 minuta</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <Mic size={20} className="text-navy mx-auto mb-2" />
            <p className="font-sans text-xs text-gray-500">Opsioni i zërit</p>
            <p className="font-sans text-sm font-semibold text-[#1a1a2e] mt-0.5">Disponueshëm</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
          <h2 className="font-serif text-base font-semibold text-navy">Rreth pyetësorit</h2>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            Ky pyetësor synon të kuptojë sfidat dhe nevojat e avokatëve shqiptarë në punën e tyre ditore — nga kërkimi ligjor deri te hartimi i dokumenteve.
          </p>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            Çdo pyetje ka mundësinë e regjistrimit të zërit, nëse preferoni të shpjegoni me fjalë.
          </p>
          <ul className="space-y-1.5">
            {['10 pyetje të shkurtra', 'Anonime dhe konfidenciale', 'Mundësi regjistrimi me zë'].map(item => (
              <li key={item} className="flex items-center gap-2 font-sans text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Start button */}
        {!hasDraft && (
          <button
            type="button"
            onClick={onStart}
            className="
              w-full flex items-center justify-center gap-2 py-4 rounded-xl
              bg-navy hover:bg-navy-light text-white
              font-sans font-semibold text-base
              transition-all duration-150 shadow-md active:scale-[0.98]
            "
          >
            Filloni Pyetësorin
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
