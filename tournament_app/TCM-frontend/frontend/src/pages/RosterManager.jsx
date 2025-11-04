import React, { useState } from 'react'

export default function RosterManager() {
  const [team, setTeam] = useState('')
  const [player, setPlayer] = useState('')
  const [status, setStatus] = useState('')

  const link = (e) => {
    e.preventDefault()
    setStatus('Player linked to roster! (Demo, not saved)')
    setTeam('')
    setPlayer('')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Roster Linking</h1>
      <form onSubmit={link} className="card space-y-4">
        <div>
          <label className="label-field">Team</label>
          <input className="input-field" value={team} onChange={e => setTeam(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Player</label>
          <input className="input-field" value={player} onChange={e => setPlayer(e.target.value)} required />
        </div>
        <button className="btn-primary" type="submit">Link Player</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
