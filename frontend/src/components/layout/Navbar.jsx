import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b bg-background px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TTS Project</span>
        </Link>

        {/* Boutons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
          <Link to="/register">
            <Button>Créer un compte</Button>
          </Link>
        </div>

      </div>
    </nav>
  )
}