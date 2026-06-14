import api from './api'

export async function generateAudio(text, voiceId, token, userId) {
  const response = await api.post('/tts/jobs', {
    text,
    voice_id: voiceId,
    user_id: userId,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}