import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'
import KPICard from '@/components/datalab/KPICard'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import {
  CheckCircle, XCircle, Clock, AlertTriangle,
  Users, Zap, FileText, Activity
} from 'lucide-react'

const COLORS = ['#f59e0b', '#22c55e', '#ef4444']

const voiceNames = {
  voice_001: 'Sophie',
  voice_002: 'Thomas',
  voice_003: 'Camille',
  voice_004: 'Lucas',
  voice_005: 'Emma',
  voice_006: 'Nathan',
}

export default function DataLabPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [pipeline, setPipeline] = useState(null)
  const [quality, setQuality] = useState(null)
  const [events, setEvents] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [s, p, q, e] = await Promise.all([
          api.get('/analytics/stats', { headers }),
          api.get('/analytics/pipeline', { headers }),
          api.get('/analytics/quality', { headers }),
          api.get('/analytics/events', { headers }),
        ])
        setStats(s.data)
        setPipeline(p.data)
        setQuality(q.data)
        setEvents(e.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground text-sm">Chargement du Data Lab...</p>
      </div>
    )
  }

  // Données pour le graphique voix
  const voiceData = pipeline?.recent_jobs?.reduce((acc, job) => {
    const name = voiceNames[job.voice_id] || job.voice_id
    const existing = acc.find(v => v.name === name)
    if (existing) existing.count++
    else acc.push({ name, count: 1 })
    return acc
  }, []) || []

  return (
    <div className="flex flex-col gap-8 max-w-5xl">

      {/* ===== BLOC 1 : USAGE ANALYTICS ===== */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Usage Analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            title="Total générations"
            value={stats?.total_jobs ?? 0}
            subtitle="Tous statuts confondus"
            color="default"
          />
          <KPICard
            title="Taux de succès"
            value={`${stats?.success_rate ?? 0}%`}
            subtitle={`${stats?.completed_jobs} complétés`}
            color="green"
          />
          <KPICard
            title="Caractères générés"
            value={stats?.total_chars?.toLocaleString() ?? 0}
            subtitle="Texte total traité"
            color="blue"
          />
          <KPICard
            title="Crédits consommés"
            value={stats?.credits_consumed ?? 0}
            subtitle={`${stats?.total_users} utilisateur(s)`}
            color="amber"
          />
        </div>
      </section>

      {/* ===== BLOC 2 : PIPELINE MONITOR ===== */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Pipeline Monitor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Donut chart statuts */}
          <div className="border rounded-xl p-5 bg-background">
            <p className="text-sm font-medium mb-4">Jobs par statut</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pipeline?.pipeline_data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {pipeline?.pipeline_data?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart voix */}
          <div className="border rounded-xl p-5 bg-background">
            <p className="text-sm font-medium mb-4">Voix les plus utilisées</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={voiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Derniers jobs */}
        <div className="border rounded-xl p-5 bg-background mt-4">
          <p className="text-sm font-medium mb-4">10 derniers jobs</p>
          <div className="flex flex-col gap-2">
            {pipeline?.recent_jobs?.map((job) => (
              <div key={job.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {job.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {job.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                  {job.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                  <span className="text-muted-foreground">{job.text_preview}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{voiceNames[job.voice_id] || job.voice_id}</span>
                  <span>{new Date(job.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOC 3 : DATA QUALITY ===== */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Data Quality
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <KPICard
            title="Score qualité"
            value={`${quality?.quality_score ?? 0}%`}
            subtitle="Score global"
            color={quality?.quality_score >= 90 ? 'green' : quality?.quality_score >= 70 ? 'amber' : 'red'}
          />
          <KPICard
            title="Audio manquants"
            value={quality?.missing_audio ?? 0}
            subtitle="Completed sans URL"
            color={quality?.missing_audio > 0 ? 'red' : 'green'}
          />
          <KPICard
            title="Doublons"
            value={quality?.duplicates ?? 0}
            subtitle="Même texte + voix"
            color={quality?.duplicates > 0 ? 'amber' : 'green'}
          />
          <KPICard
            title="Textes vides"
            value={quality?.empty_text ?? 0}
            subtitle="Jobs sans contenu"
            color={quality?.empty_text > 0 ? 'red' : 'green'}
          />
        </div>
      </section>

      {/* ===== BLOC 4 : EVENT TRACKING ===== */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Event Tracking
        </h2>

        {/* Types d'événements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {events?.event_types?.map((et) => (
            <KPICard
              key={et.type}
              title={et.type.replace(/_/g, ' ')}
              value={et.count}
              subtitle="événements"
              color="blue"
            />
          ))}
        </div>

        {/* Table des événements */}
        <div className="border rounded-xl p-5 bg-background">
          <p className="text-sm font-medium mb-4">
            Derniers événements ({events?.total_events ?? 0})
          </p>
          {events?.events?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun événement enregistré.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {events?.events?.map((event) => (
                <div key={event.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                      {event.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      user: {event.user_id?.slice(-8)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}