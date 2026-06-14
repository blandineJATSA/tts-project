import { CheckCircle, XCircle, Clock, Volume2, Download } from 'lucide-react'

const statusConfig = {
  completed: {
    icon: CheckCircle,
    label: 'Généré',
    className: 'text-green-600 bg-green-50'
  },
  pending: {
    icon: Clock,
    label: 'En cours',
    className: 'text-amber-600 bg-amber-50'
  },
  failed: {
    icon: XCircle,
    label: 'Échec',
    className: 'text-red-600 bg-red-50'
  }
}

const voiceNames = {
  voice_001: 'Sophie',
  voice_002: 'Thomas',
  voice_003: 'Camille',
  voice_004: 'Lucas',
  voice_005: 'Emma',
  voice_006: 'Nathan',
}

export default function JobCard({ job }) {
  const status = statusConfig[job.status] || statusConfig.pending
  const StatusIcon = status.icon

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = job.audio_url
    link.download = `audio-${job.id}.wav`
    link.click()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="border rounded-xl p-5 bg-background flex flex-col gap-4">

      {/* En-tête : statut + date */}
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDate(job.created_at)}
        </span>
      </div>

      {/* Texte généré */}
      <p className="text-sm text-foreground line-clamp-2">
        {job.text}
      </p>

      {/* Voix utilisée */}
      <p className="text-xs text-muted-foreground">
        Voix : {voiceNames[job.voice_id] || job.voice_id}
      </p>

      {/* Lecteur audio si completed */}
      {job.status === 'completed' && job.audio_url && (
        <div className="flex flex-col gap-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Volume2 className="h-3.5 w-3.5 text-primary" />
            Écouter
          </div>
          <audio controls src={job.audio_url} className="w-full h-8" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </button>
        </div>
      )}

      {/* Message d'erreur si failed */}
      {job.status === 'failed' && job.error_message && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {job.error_message}
        </p>
      )}

    </div>
  )
}