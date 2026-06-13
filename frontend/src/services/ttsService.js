import api from './api'

export async function generateAudio(text, voiceId, userId = 'user_demo') {
  const response = await api.post('/tts/jobs', {
    text,
    voice_id: voiceId,
    user_id: userId,
  })
  return response.data
}