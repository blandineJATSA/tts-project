import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Temporaire : on connectera au backend plus tard
    console.log('Connexion avec :', { email, password })

    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Mic className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">TTS Project</span>
        </div>

        {/* Carte formulaire */}
        <div className="bg-background border rounded-xl p-8 shadow-sm">

          <h1 className="text-2xl font-bold mb-2">Connexion</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Content de vous revoir ! Entrez vos identifiants.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-lg px-3 py-2 text-sm bg-background
                           focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-lg px-3 py-2 text-sm bg-background
                           focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Bouton */}
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}