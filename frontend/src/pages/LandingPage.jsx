import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import { Mic, Download, History, Zap, Users, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <Navbar />

      {/* ===== SECTION 1 : HERO ===== */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">

        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Synthèse vocale professionnelle
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Transformez votre texte
          <span className="text-primary"> en voix naturelle</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Générez des voix claires et naturelles en quelques secondes.
          Idéal pour le support client, les vidéos, les podcasts et bien plus encore.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="px-8">
              Commencer gratuitement
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="px-8">
              Se connecter
            </Button>
          </Link>
        </div>

      </section>

      {/* ===== SECTION 2 : FEATURES ===== */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Une solution complète pour générer et gérer vos fichiers audio
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-background rounded-xl p-6 border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Voix naturelles</h3>
              <p className="text-muted-foreground text-sm">
                Choisissez parmi plusieurs voix masculines et féminines,
                professionnelles ou chaleureuses.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Téléchargement facile</h3>
              <p className="text-muted-foreground text-sm">
                Écoutez l'aperçu et téléchargez votre fichier audio
                en un seul clic.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Historique complet</h3>
              <p className="text-muted-foreground text-sm">
                Retrouvez toutes vos générations passées,
                réécoutez et retéléchargez à tout moment.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION 3 : CTA ===== */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">

        <div className="flex items-center justify-center gap-8 mb-10 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm">Support client</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <span className="text-sm">Podcasts & vidéos</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm">Disponible 24/7</span>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-4">
          Prêt à démarrer ?
        </h2>
        <p className="text-muted-foreground mb-8">
          10 000 caractères gratuits par mois. Sans carte bancaire.
        </p>

        <Link to="/register">
          <Button size="lg" className="px-10">
            Créer un compte gratuit
          </Button>
        </Link>

      </section>

    </div>
  )
}