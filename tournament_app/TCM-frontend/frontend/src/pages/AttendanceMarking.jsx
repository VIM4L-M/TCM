import React, { useState } from 'react'

export default function AttendanceMarking() {
  const [player, setPlayer] = useState('')
  const [present, setPresent] = useState(false)
  const [status, setStatus] = useState('')

  const markAttendance = (e) => {
    e.preventDefault()
    setStatus(`Attendance marked: ${player} is ${present ? 'Present' : 'Absent'} (Demo, not saved)`)
    setPlayer('')
    setPresent(false)
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Attendance Marking</h1>
      <form onSubmit={markAttendance} className="card space-y-4">
        <div>
          <label className="label-field">Player Name</label>
          <input className="input-field" value={player} onChange={e => setPlayer(e.target.value)} required />
        </div>
        <div>
          <label className="label-field">Present?</label>
          <input type="checkbox" checked={present} onChange={e => setPresent(e.target.checked)} />
        </div>
        <button className="btn-primary" type="submit">Mark Attendance</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
