import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth()

  // Pendant le chargement initial (vérification du token en localStorage)
  // on n'affiche rien pour éviter un flash de redirection
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Chargement...</p>
      </div>
    )
  }

  // Si pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}