import { useState } from 'react'
import TextEditor from '@/components/tts/TextEditor'
import VoiceSelector from '@/components/tts/VoiceSelector'
import AudioPlayer from '@/components/tts/AudioPlayer'
import GenerateButton from '@/components/tts/GenerateButton'
import { generateAudio } from '@/services/ttsService'
import { useAuth } from '@/context/AuthContext'


export default function GeneratorPage() {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const { token, user } = useAuth()

  const canGenerate = text.trim().length > 0 && selectedVoice !== null

  const handleGenerate = async () => {
    setIsGenerating(true)
    setAudioUrl(null)
    setError(null)

    try {
      const result = await generateAudio(text, selectedVoice.id, token, user.id)

      if (result.status === 'completed') {
        setAudioUrl(result.audio_url)
      } else {
        setError(result.error || 'La génération a échoué.')
      }
    } catch (err) {
      setError('Impossible de contacter le serveur. Vérifiez que le backend est lancé.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">

      {/* Zone de texte */}
      <TextEditor text={text} onChange={setText} />

      {/* Choix de la voix */}
      <VoiceSelector selectedVoice={selectedVoice} onSelect={setSelectedVoice} />

      {/* Bouton générer */}
      <GenerateButton
        onClick={handleGenerate}
        isGenerating={isGenerating}
        disabled={!canGenerate}
      />

      {/* Message d'erreur */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Lecteur audio (visible seulement si audioUrl existe) */}
      <AudioPlayer audioUrl={audioUrl} />

    </div>
  )
}