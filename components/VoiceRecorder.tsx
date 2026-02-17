import { useEffect } from 'react'
import { Mic, Square, RotateCcw } from 'lucide-react'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { AudioPlayback } from './AudioPlayback'

interface VoiceRecorderProps {
  onRecordingChange: (blob: Blob | null, durationSec?: number) => void
}

export function VoiceRecorder({ onRecordingChange }: VoiceRecorderProps) {
  const {
    isRecording,
    hasRecording,
    audioBlob,
    audioUrl,
    durationSec,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  } = useVoiceRecorder()

  // Notify parent whenever a recording becomes available or is cleared
  useEffect(() => {
    if (hasRecording && audioBlob) {
      onRecordingChange(audioBlob, durationSec)
    }
  }, [hasRecording, audioBlob]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClear = () => {
    clearRecording()
    onRecordingChange(null)
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400 font-sans uppercase tracking-wide px-2">
          ose regjistroni me zë
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {hasRecording && audioUrl ? (
        <div className="space-y-2">
          <AudioPlayback
            audioUrl={audioUrl}
            durationSec={durationSec}
            onClear={handleClear}
          />
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy transition-colors mx-auto"
          >
            <RotateCcw size={12} />
            Riregjistroni
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`
                relative w-16 h-16 rounded-full flex items-center justify-center
                transition-all duration-200 shadow-md active:scale-95
                ${isRecording
                  ? 'bg-red-600 hover:bg-red-700 recording-pulse'
                  : 'bg-navy hover:bg-navy-light'
                }
              `}
            >
              {isRecording ? (
                <Square size={22} className="text-white fill-white" />
              ) : (
                <Mic size={22} className="text-white" />
              )}
            </button>
          </div>

          <span className="text-xs font-sans text-gray-500">
            {isRecording ? (
              <span className="text-red-600 font-medium tabular-nums">
                {String(Math.floor(durationSec / 60)).padStart(2, '0')}:
                {String(durationSec % 60).padStart(2, '0')} — Shtypni për të ndalur
              </span>
            ) : (
              'Shtypni mikrofon për të regjistruar'
            )}
          </span>

          {error && (
            <p className="text-xs text-red-500 text-center font-sans px-4 max-w-xs">{error}</p>
          )}
        </div>
      )}
    </div>
  )
}
