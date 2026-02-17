import { Trash2 } from 'lucide-react'

interface AudioPlaybackProps {
  audioUrl: string
  durationSec: number
  onClear: () => void
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayback({ audioUrl, durationSec, onClear }: AudioPlaybackProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
      <audio
        src={audioUrl}
        controls
        className="h-8 flex-1 min-w-0"
        style={{ accentColor: '#1e3a5f' }}
      />
      <span className="text-xs text-green-700 font-mono flex-shrink-0">
        {formatDuration(durationSec)}
      </span>
      <button
        type="button"
        onClick={onClear}
        title="Fshij regjistrimin"
        className="flex-shrink-0 p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
