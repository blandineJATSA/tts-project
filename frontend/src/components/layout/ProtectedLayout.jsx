import { Navigate, Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

// Temporaire : simule un utilisateur connecté
// On remplacera ça par le vrai système d'auth plus tard
const isAuthenticated = true

export default function ProtectedLayout() {

  // Si non connecté → redirection vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar gauche */}
      <AppSidebar />

      {/* Zone droite : header + contenu */}
      <div className="flex flex-col flex-1">
        <AppHeader />

        {/* Contenu de la page */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}