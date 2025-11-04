import React, { useState } from 'react'

export default function JerseyVerification() {
  const [player, setPlayer] = useState('')
  const [jersey, setJersey] = useState('')
  const [status, setStatus] = useState('')

  const verify = (e) => {
    e.preventDefault()
    setStatus(`Jersey #${jersey} for ${player} verified! (Demo, not saved)`)
    setPlayer('')
    setJersey('')
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Jersey Verification</h1>
      <form onSubmit={verify} className="card space-y-4">
        <div>
          <label className="label-field">Player Name</label>
          <input className="input-field" value={player} onChange={e => setPlayer(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Jersey Number</label>
          <input className="input-field" value={jersey} onChange={e => setJersey(e.target.value)} required />
        </div>
        <button className="btn-primary" type="submit">Verify Jersey</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
