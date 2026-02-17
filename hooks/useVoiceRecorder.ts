import { useState, useRef, useCallback } from 'react'

export interface UseVoiceRecorderReturn {
  isRecording: boolean
  hasRecording: boolean
  audioBlob: Blob | null
  audioUrl: string | null
  durationSec: number
  error: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearRecording: () => void
}

const MAX_DURATION_SEC = 60

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [durationSec, setDurationSec] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current)
      autoStopRef.current = null
    }
  }, [])

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    setError(null)
    chunksRef.current = []

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
    } catch {
      setError('Nuk mund të aksesohet mikrofoni. Ju lutem lejoni aksesin.')
      return
    }

    streamRef.current = stream

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    const mediaRecorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const url = URL.createObjectURL(blob)
      setAudioBlob(blob)
      setAudioUrl(url)
      setHasRecording(true)
      setIsRecording(false)
      stopStream()
    }

    mediaRecorder.start(1000)
    startTimeRef.current = Date.now()
    setIsRecording(true)
    setDurationSec(0)

    timerRef.current = setInterval(() => {
      setDurationSec(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)

    autoStopRef.current = setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
        clearTimers()
      }
    }, MAX_DURATION_SEC * 1000)
  }, [clearTimers, stopStream])

  const stopRecording = useCallback(() => {
    clearTimers()
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [clearTimers])

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setHasRecording(false)
    setDurationSec(0)
    setError(null)
  }, [audioUrl])

  return {
    isRecording,
    hasRecording,
    audioBlob,
    audioUrl,
    durationSec,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  }
}
