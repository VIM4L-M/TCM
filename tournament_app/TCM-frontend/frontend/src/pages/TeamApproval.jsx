import React, { useState } from 'react'

export default function TeamApproval() {
  const [team, setTeam] = useState('')
  const [approved, setApproved] = useState(false)
  const [status, setStatus] = useState('')

  const approveTeam = (e) => {
    e.preventDefault()
    setStatus(`Team "${team}" ${approved ? 'approved' : 'rejected'}! (Demo, not saved)`)
    setTeam('')
    setApproved(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Team Approval Workflow</h1>
      <form onSubmit={approveTeam} className="card space-y-4">
        <div>
          <label className="label-field">Team Name</label>
          <input className="input-field" value={team} onChange={e => setTeam(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Approve?</label>
          <input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} />
        </div>
        <button className="btn-primary" type="submit">Submit</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
