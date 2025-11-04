import React, { useEffect, useMemo, useState } from 'react'
import { fetchTournaments } from '../api'
import { seedTournaments } from '../data/seed'
import LoadingSpinner from '../components/LoadingSpinner'

const Schedule = () => {
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [tournament, setTournament] = useState(null)
  const [tab, setTab] = useState('ongoing') // upcoming | ongoing | completed

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchTournaments()
      if (data === null) {
        // pick the first active tournament, else first
        const t = seedTournaments.find(t => t.status === 'active') || seedTournaments[0]
        setTournament(t)
        setDemoMode(true)
      } else {
        // choose first tournament for now
        setTournament(data[0])
        setDemoMode(false)
      }
      setLoading(false)
    }
    load()
  }, [])

  const matchesByStatus = useMemo(() => {
    if (!tournament?.matches) return { upcoming: [], ongoing: [], completed: [] }
    const sorted = [...tournament.matches].sort((a,b) => new Date(a.start_time) - new Date(b.start_time))
    return {
      upcoming: sorted.filter(m => m.status === 'upcoming'),
      ongoing: sorted.filter(m => m.status === 'ongoing'),
      completed: sorted.filter(m => m.status === 'completed'),
    }
  }, [tournament])

  const updateMatchScore = (matchId, newA, newB) => {
    setTournament(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.matches = updated.matches.map(mm => mm.id === matchId ? { ...mm, score: { a: newA, b: newB } } : mm)
      return updated
    })
  }

  const setMatchStatus = (matchId, newStatus) => {
    setTournament(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.matches = updated.matches.map(mm => mm.id === matchId ? { ...mm, status: newStatus } : mm)
      return updated
    })
  }

  const renderMatch = (m) => {
    const dt = new Date(m.start_time)
    const time = dt.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    const field = tournament.fields?.find(f => f.id === m.field_id)?.name || 'Field'
    return (
      <div key={m.id} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {m.status === 'ongoing' && (
            <span className="badge badge-success">LIVE</span>
          )}
          <div>
            <div className="font-semibold text-gray-900">{m.teams[0]} <span className="text-gray-400">vs</span> {m.teams[1]}</div>
            <div className="text-sm text-gray-600">{time} • {field}</div>
          </div>
        </div>
        <div className="text-right">
          {m.status === 'completed' && (
            <div className="text-lg font-mono font-bold">{m.score.a} - {m.score.b}</div>
          )}
          {m.status === 'ongoing' && (
            <div className="flex items-center gap-2 justify-end">
              <div className="text-lg font-mono font-bold text-live-orange">{m.score.a}</div>
              <div className="text-lg font-mono font-bold">-</div>
              <div className="text-lg font-mono font-bold text-live-orange">{m.score.b}</div>
            </div>
          )}
          {m.status === 'upcoming' && (
            <div className="text-sm text-gray-500">Scheduled</div>
          )}
          {/* Live scoring controls for volunteers */}
          {m.status === 'ongoing' && (
            <div className="mt-3 flex items-center gap-2 justify-end">
              <input type="number" min={0} value={m.score.a} onChange={(e) => updateMatchScore(m.id, Number(e.target.value || 0), m.score.b)} className="w-16 input-field text-center" />
              <span className="text-sm">—</span>
              <input type="number" min={0} value={m.score.b} onChange={(e) => updateMatchScore(m.id, m.score.a, Number(e.target.value || 0))} className="w-16 input-field text-center" />
              <button onClick={() => setMatchStatus(m.id, 'completed')} className="btn-primary py-1 px-3">Mark Completed</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading schedule..." />
      </div>
    )
  }

  if (!tournament) {
    return <div className="card">No tournament found</div>
  }

  const tabs = [
    { id: 'ongoing', label: `Ongoing (${matchesByStatus.ongoing.length})` },
    { id: 'upcoming', label: `Upcoming (${matchesByStatus.upcoming.length})` },
    { id: 'completed', label: `Completed (${matchesByStatus.completed.length})` },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">{tournament.title} Schedule</h1>
        <p className="text-gray-600">{new Date(tournament.start_date).toLocaleDateString()} – {new Date(tournament.end_date).toLocaleDateString()} • {tournament.location}</p>
        <div className="mt-2 text-xs text-gray-500">{demoMode ? 'Demo mode' : 'Live data'}</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${tab===t.id ? 'bg-tournament-blue text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(matchesByStatus[tab] || []).map(renderMatch)}
        {matchesByStatus[tab]?.length === 0 && (
          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-600">No matches in this category</div>
        )}
      </div>
    </div>
  )
}

export default Schedule
