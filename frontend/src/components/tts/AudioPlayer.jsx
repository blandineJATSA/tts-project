import { Download, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AudioPlayer({ audioUrl }) {
  if (!audioUrl) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `tts-audio-${Date.now()}.mp3`
    link.click()
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-muted/40 rounded-xl border">

      {/* Titre */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Volume2 className="h-4 w-4 text-primary" />
        Audio généré
      </div>

      {/* Lecteur natif HTML5 */}
      <audio
        controls
        src={audioUrl}
        className="w-full h-10"
      />

      {/* Bouton télécharger */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="w-fit"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger le fichier audio
      </Button>

    </div>
  )
}