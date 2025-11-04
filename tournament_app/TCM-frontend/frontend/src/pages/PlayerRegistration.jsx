import React, { useState } from 'react'

export default function PlayerRegistration() {
  const [form, setForm] = useState({ name: '', age: '', gender: '', experience: '' })
  const [status, setStatus] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setStatus('Registered! (Demo, not saved)')
    setForm({ name: '', age: '', gender: '', experience: '' })
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Player Registration</h1>
      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label-field">Name</label>
          <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Age</label>
            <input type="number" className="input-field" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
          </div>
          <div>
            <label className="label-field">Gender</label>
            <select className="select-field" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label-field">Experience</label>
          <select className="select-field" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button className="btn-primary" type="submit">Register</button>
        {status && <p className="text-sm text-success mt-2">{status}</p>}
      </form>
    </div>
  )
}
