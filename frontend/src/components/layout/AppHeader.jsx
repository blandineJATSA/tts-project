import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Coins } from 'lucide-react'

const pageTitles = {
  '/app/generate': 'Créer un audio',
  '/app/history':  'Historique',
  '/app/voices':   'Voix disponibles',
  '/app/files':    'Mes fichiers',
  '/app/settings': 'Paramètres',
  '/app/datalab':  'Data Lab',
}

export default function AppHeader() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'TTS Project'

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Titre de la page */}
        <h1 className="text-lg font-semibold">{title}</h1>

        {/* Droite : crédits + déconnexion */}
        <div className="flex items-center gap-4">

          {/* Compteur de crédits */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            <span><strong>1000</strong> crédits</span>
          </div>

          {/* Bouton déconnexion */}
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>

        </div>
      </div>
    </header>
  )
}