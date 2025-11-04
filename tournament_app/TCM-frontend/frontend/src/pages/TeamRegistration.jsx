import React, { useState } from 'react'

export default function TeamRegistration() {
  const [form, setForm] = useState({ name: '', captain: '', email: '', phone: '' })
  const [status, setStatus] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setStatus('Team submitted! (Demo, not saved)')
    setForm({ name: '', captain: '', email: '', phone: '' })
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Team Registration</h1>
      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label-field">Team Name</label>
          <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="label-field">Captain</label>
          <input className="input-field" value={form.captain} onChange={e => setForm(f => ({ ...f, captain: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Email</label>
            <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>
        <button className="btn-primary" type="submit">Register Team</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
