import React, { useEffect, useState } from 'react'
import { fetchPlayers } from '../api'
import { seedPlayers } from '../data/seed'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const Players = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await fetchPlayers()
      if (data === null) {
        setPlayers(seedPlayers)
        setDemoMode(true)
      } else {
        setPlayers(data)
        setDemoMode(false)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-[200px]"><LoadingSpinner message="Loading players..." /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Players</h1>
        <Link to="/players/new" className="btn-primary py-2 px-4">Add Player</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map(p => (
          <Link to={`/players/${p.id}`} key={p.id} className="card hover:shadow-md flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-semibold">{p.first_name[0]}{p.last_name[0]}</div>
            <div>
              <div className="font-semibold text-gray-900">{p.display_name}</div>
              <div className="text-sm text-gray-600">{p.email}</div>
              <div className="text-xs text-gray-500 mt-1">Teams: {p.teams?.map(t => t.team_name).join(', ')}</div>
            </div>
          </Link>
        ))}
      </div>

      {demoMode && <div className="text-sm text-gray-500 mt-4">Demo mode: players loaded from local seed data.</div>}
    </div>
  )
}

export default Players
