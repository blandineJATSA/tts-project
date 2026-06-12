import { useState } from 'react'
import TextEditor from '@/components/tts/TextEditor'
import VoiceSelector from '@/components/tts/VoiceSelector'
import AudioPlayer from '@/components/tts/AudioPlayer'
import GenerateButton from '@/components/tts/GenerateButton'

export default function GeneratorPage() {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)

  const canGenerate = text.trim().length > 0 && selectedVoice !== null

  const handleGenerate = () => {
    setIsGenerating(true)
    setAudioUrl(null)

    // Temporaire : simulation d'appel backend
    // On remplacera ça par un vrai appel API à l'Étape 7
    console.log('Génération avec :', { text, voice: selectedVoice.name })

    setTimeout(() => {
      // URL audio fictive pour tester le lecteur
      setAudioUrl('https://www.w3schools.com/html/horse.mp3')
      setIsGenerating(false)
    }, 1500)
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

      {/* Lecteur audio (visible seulement si audioUrl existe) */}
      <AudioPlayer audioUrl={audioUrl} />

    </div>
  )
}