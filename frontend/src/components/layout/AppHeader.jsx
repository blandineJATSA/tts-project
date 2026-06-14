import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Coins } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
  const { user, logout } = useAuth()
  const title = pageTitles[location.pathname] || 'TTS Project'

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">

        <h1 className="text-lg font-semibold">{title}</h1>

        <div className="flex items-center gap-4">

          {/* Crédits réels depuis le Context */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-primary" />
            <span><strong>{user?.credits ?? 1000}</strong> crédits</span>
          </div>

          {/* Nom de l'utilisateur connecté */}
          <span className="text-sm font-medium text-muted-foreground">
            {user?.name}
          </span>

          {/* Bouton déconnexion → appelle logout() du Context */}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>

        </div>
      </div>
    </header>
  )
}