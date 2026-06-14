import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import JobCard from '@/components/history/JobCard'
import api from '@/services/api'
import { History } from 'lucide-react'

export default function HistoryPage() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setJobs(response.data.jobs)
      } catch (err) {
        setError('Impossible de charger l\'historique.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground text-sm">Chargement de l'historique...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <History className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          Aucune génération pour l'instant.
        </p>
        <p className="text-muted-foreground text-xs">
          Créez votre premier audio dans la page "Créer un audio".
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {jobs.length} génération{jobs.length > 1 ? 's' : ''} trouvée{jobs.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

    </div>
  )
}