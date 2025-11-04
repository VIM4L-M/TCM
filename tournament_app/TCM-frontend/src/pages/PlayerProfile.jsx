import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPlayer, fetchPlayers } from '../api'
import { seedPlayers, seedTournaments } from '../data/seed'
import LoadingSpinner from '../components/LoadingSpinner'

const PlayerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchPlayer(id)
      if (data === null) {
        // find in seed
        const p = seedPlayers.find(s => s.id === id)
        setPlayer(p)
        setDemoMode(true)
      } else {
        setPlayer(data)
        setDemoMode(false)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="flex items-center justify-center min-h-[240px]"><LoadingSpinner message="Loading player..." /></div>
  if (!player) return <div className="card">Player not found</div>

  const tournaments = (player.participation || []).map(p => {
    const t = seedTournaments.find(s => s.id === p.tournament_id)
    return { ...p, title: t?.title || p.tournament_id }
  })

  return (
    <div>
      <div className="flex items-start gap-6 mb-6">
        <div className="w-28 h-28 rounded-lg bg-gray-100 flex items-center justify-center text-4xl font-semibold">{player.first_name[0]}{player.last_name[0]}</div>
        <div>
          <h1 className="text-2xl font-display font-bold">{player.display_name}</h1>
          <div className="text-sm text-gray-600">{player.email}</div>
          <div className="mt-2 text-sm text-gray-700">{player.experience} • Age {player.age} • {player.gender}</div>
          <div className="mt-4 flex gap-2">
            <button className="btn-secondary" onClick={() => navigate('/players')}>Back</button>
            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Participation</h3>
          {tournaments.length === 0 && <div className="text-sm text-gray-500">No participation records</div>}
          {tournaments.map((tr, idx) => (
            <div key={idx} className="border-b border-gray-100 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{tr.title}</div>
                  <div className="text-xs text-gray-500">Matches played: {tr.matches_played}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold">Spirit avg: {tr.spirit_avg}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-3">Teams</h3>
          {player.teams?.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <div className="font-medium">{t.team_name}</div>
                <div className="text-xs text-gray-500">Tournament: {t.tournament_id}</div>
              </div>
              <div className="text-sm text-gray-500">Role: Player</div>
            </div>
          ))}
        </div>
      </div>

      {demoMode && <div className="text-sm text-gray-500 mt-4">Demo mode: profile loaded from seed data.</div>}
    </div>
  )
}

export default PlayerProfile
