import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './constants'
import type { QuestionAnswer } from './types'

export interface VoiceUploadResult {
  questionId: number
  url: string
  durationSec?: number
}

export async function uploadVoiceToCloudinary(
  blob: Blob,
  questionId: number,
  submittedAt: string
): Promise<string> {
  const formData = new FormData()
  formData.append('file', blob, `pyetja-${questionId}.webm`)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('resource_type', 'video')
  formData.append('public_id', `pyetja-${questionId}-${submittedAt.replace(/[:.]/g, '-')}`)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`)
  }

  const data = await response.json() as { secure_url: string }
  return data.secure_url
}

export async function uploadAllVoices(
  answers: QuestionAnswer[],
  submittedAt: string
): Promise<VoiceUploadResult[]> {
  const withVoice = answers.filter(a => a.voiceBlob)
  const results = await Promise.allSettled(
    withVoice.map(async a => {
      const url = await uploadVoiceToCloudinary(a.voiceBlob!, a.questionId, submittedAt)
      const result: VoiceUploadResult = { questionId: a.questionId, url, durationSec: a.voiceDurationSec }
      return result
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<VoiceUploadResult> => r.status === 'fulfilled')
    .map(r => r.value)
}
