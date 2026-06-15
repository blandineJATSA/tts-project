import { useState } from 'react'
import TextEditor from '@/components/tts/TextEditor'
import VoiceSelector from '@/components/tts/VoiceSelector'
import AudioPlayer from '@/components/tts/AudioPlayer'
import GenerateButton from '@/components/tts/GenerateButton'
import { generateAudio } from '@/services/ttsService'
import { useAuth } from '@/context/AuthContext'

export default function GeneratorPage() {
  const { token, user, updateCredits } = useAuth()
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)

  const canGenerate = text.trim().length > 0 && selectedVoice !== null

  const handleGenerate = async () => {
    setIsGenerating(true)
    setAudioUrl(null)
    setError(null)

    try {
      const result = await generateAudio(text, selectedVoice.id, token, user.id)

      if (result.status === 'completed') {
        setAudioUrl(result.audio_url)
        // Mise à jour des crédits en temps réel dans le header
        if (result.credits_remaining !== undefined) {
          updateCredits(result.credits_remaining)
        }
      } else if (result.status === 'error') {
        setError(result.message)
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

      {/* Compteur de crédits disponibles */}
      <div className="text-sm text-muted-foreground">
        Coût estimé : <strong>{text.length}</strong> crédits
        {' · '}
        Solde : <strong>{user?.credits ?? 0}</strong> crédits
      </div>

      <TextEditor text={text} onChange={setText} />
      <VoiceSelector selectedVoice={selectedVoice} onSelect={setSelectedVoice} />

      <GenerateButton
        onClick={handleGenerate}
        isGenerating={isGenerating}
        disabled={!canGenerate || text.length > (user?.credits ?? 0)}
      />

      {/* Message si crédits insuffisants */}
      {text.length > (user?.credits ?? 0) && (
        <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          Texte trop long — vous n'avez pas assez de crédits ({text.length} requis, {user?.credits ?? 0} disponibles).
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <AudioPlayer audioUrl={audioUrl} />

    </div>
  )
}