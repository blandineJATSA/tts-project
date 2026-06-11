import { Link, useLocation } from 'react-router-dom'
import { Mic, History, AudioLines, FolderOpen, Settings, FlaskConical } from 'lucide-react'

const menuItems = [
  { icon: Mic,          label: 'Créer un audio',  path: '/app/generate' },
  { icon: History,      label: 'Historique',       path: '/app/history'  },
  { icon: AudioLines,   label: 'Voix',             path: '/app/voices'   },
  { icon: FolderOpen,   label: 'Fichiers',         path: '/app/files'    },
  { icon: Settings,     label: 'Paramètres',       path: '/app/settings' },
]

const dataItems = [
  { icon: FlaskConical, label: 'Data Lab', path: '/app/datalab' },
]

export default function AppSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 min-h-screen border-r bg-background flex flex-col px-4 py-6">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Mic className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">TTS Project</span>
      </div>

      {/* Menu principal */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Section Data Lab */}
      <div className="border-t pt-4 mt-4">
        <p className="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-wider">
          Data Engineer
        </p>
        {dataItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

    </aside>
  )
}