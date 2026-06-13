import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'

export default function GenerateButton({ onClick, isGenerating, disabled }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isGenerating}
      size="lg"
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Génération en cours...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Générer l'audio
        </>
      )}
    </Button>
  )
}