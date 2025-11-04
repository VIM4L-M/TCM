
import React, { useEffect, useMemo, useState } from 'react'
import { fetchTournaments } from '../api'
import { seedTournaments } from '../data/seed'
import LoadingSpinner from '../components/LoadingSpinner'

const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchTournaments()
        if (data === null) {
          setTournaments([...seedTournaments])
          setDemoMode(true)
        } else {
          setTournaments(data)
          setDemoMode(false)
        }
        // Default to first tournament
        setSelectedId((data && data.length > 0 ? data[0].id : seedTournaments[0]?.id) || '')
      } catch (e) {
        console.error('Error loading tournaments for leaderboard', e)
        setError(e.message || String(e))
      }
      setLoading(false)
    }
    load()
  }, [])

  const tournament = useMemo(() => tournaments.find(t => t.id === selectedId) || tournaments[0], [tournaments, selectedId])

  const standings = useMemo(() => {
    if (!tournament) return []
    // build map of team stats
    const teams = {}
    if (Array.isArray(tournament.teams)) {
      tournament.teams.forEach(t => {
        teams[t.name] = { name: t.name, played: 0, wins: 0, losses: 0, draws: 0, points_for: 0, points_against: 0, diff: 0, pts: 0 }
      })
    }

    (tournament.matches || []).forEach(m => {
      if (!m.score) return
      const aName = m.teams[0]
      const bName = m.teams[1]
      const a = teams[aName] || (teams[aName] = { name: aName, played: 0, wins: 0, losses: 0, draws: 0, points_for: 0, points_against: 0, diff: 0, pts: 0 })
      const b = teams[bName] || (teams[bName] = { name: bName, played: 0, wins: 0, losses: 0, draws: 0, points_for: 0, points_against: 0, diff: 0, pts: 0 })

      if (m.status === 'completed' || m.status === 'ongoing') {
        a.played += 1
        b.played += 1
        a.points_for += m.score.a
        a.points_against += m.score.b
        b.points_for += m.score.b
        b.points_against += m.score.a
        a.diff = a.points_for - a.points_against
        b.diff = b.points_for - b.points_against

        if (m.score.a > m.score.b) {
          a.wins += 1; b.losses += 1; a.pts += 3
        } else if (m.score.a < m.score.b) {
          b.wins += 1; a.losses += 1; b.pts += 3
        } else {
          a.draws += 1; b.draws += 1; a.pts += 1; b.pts += 1
        }
      }
    })

    return Object.values(teams).sort((x,y) => y.pts - x.pts || y.diff - x.diff || y.points_for - x.points_for)
  }, [tournament])

  if (loading) return <div className="flex items-center justify-center min-h-[200px] bg-white p-8"><LoadingSpinner message="Loading leaderboard..." /></div>
  if (error) return <div className="bg-white p-8 rounded-xl shadow text-red-600 font-semibold">Error loading leaderboard: {error}</div>
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600 mb-4">No tournaments found. Please create a tournament first.</p>
      </div>
    )
  }
  if (!tournament) {
    return (
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600 mb-4">No tournament selected or found.</p>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Tournament</label>
          <select className="select-field" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }
  if (!loading && standings.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow">
        <div className="mb-4">
          <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tournament</label>
            <select className="select-field" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">No standings available yet. Below are the current match statuses.</p>
        </div>
        <div className="card space-y-3">
          {(tournament.matches || []).map(m => (
            <div key={m.id} className="p-3 border-b flex items-center justify-between">
              <div>
                <div className="font-medium">{m.teams?.[0]} vs {m.teams?.[1]}</div>
                <div className="text-xs text-gray-500">{new Date(m.start_time).toLocaleString()} • {m.status}</div>
              </div>
              <div className="text-sm font-mono">{m.score ? `${m.score.a} - ${m.score.b}` : '—'}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Tournament</label>
          <select className="select-field" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600">Auto standings based on available match results</p>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="p-3">#</th>
              <th className="p-3">Team</th>
              <th className="p-3">P</th>
              <th className="p-3">W</th>
              <th className="p-3">D</th>
              <th className="p-3">L</th>
              <th className="p-3">GF</th>
              <th className="p-3">GA</th>
              <th className="p-3">GD</th>
              <th className="p-3">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, idx) => (
              <tr key={s.name} className="border-t">
                <td className="p-3">{idx+1}</td>
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.played}</td>
                <td className="p-3">{s.wins}</td>
                <td className="p-3">{s.draws}</td>
                <td className="p-3">{s.losses}</td>
                <td className="p-3">{s.points_for}</td>
                <td className="p-3">{s.points_against}</td>
                <td className="p-3">{s.diff}</td>
                <td className="p-3 font-semibold">{s.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {demoMode && <div className="text-sm text-gray-500 mt-3">Demo mode: standings computed from seed matches.</div>}
    </div>
  )
}

export default Leaderboard
