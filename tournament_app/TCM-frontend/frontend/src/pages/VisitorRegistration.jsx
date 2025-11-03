import React, { useState, useEffect } from 'react'
import { postVisitor, fetchVisitors, updateVisitor } from '../api'
// import { seedVisitors, generateId } from '../data/seed'
import DemoBanner from '../components/DemoBanner'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const VisitorRegistration = () => {
  const [visitors, setVisitors] = useState([])
  const [demoMode, setDemoMode] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'guest'
  })

  useEffect(() => {
    loadVisitors()
  }, [])

  const loadVisitors = async () => {
    const data = await fetchVisitors()
    
    if (data === null) {
      // Backend unavailable, use seed data
      setVisitors([...seedVisitors])
      setDemoMode(true)
    } else {
      setVisitors(data)
      setDemoMode(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error')
      return
    }

    const newVisitor = await postVisitor(formData)
    setVisitors(prev => [newVisitor, ...prev])
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'guest'
    })

    showToast('Visitor registered successfully', 'success')
  }

  const handleCheckIn = async (visitor) => {
    const updated = await updateVisitor(visitor.id, { checked_in: !visitor.checked_in })
    setVisitors(prev => prev.map(v => 
      v.id === visitor.id ? { ...v, checked_in: !v.checked_in } : v
    ))
    showToast(
      updated.checked_in ? 'Visitor checked in' : 'Check-in cancelled',
      'success'
    )
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getRoleBadge = (role) => {
    const badges = {
      guest: 'badge-info',
      volunteer: 'badge-success',
      press: 'badge-warning'
    }
    return badges[role] || 'badge-info'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {demoMode && <DemoBanner onDismiss={() => setDemoMode(false)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate mb-2">Visitor Registration</h1>
        <p className="text-gray-600">Register and manage tournament visitors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold text-slate mb-4">Register Visitor</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-field">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-field">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="input-field"
                  placeholder="+1-555-0123"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label-field">Role *</label>
                <select
                  name="role"
                  className="select-field"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="guest">Guest</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="press">Press</option>
                </select>
              </div>

              <button type="submit" className="btn-cta w-full">
                Register Visitor
              </button>
            </form>
          </div>
        </div>

        {/* Visitors List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate">Recent Visitors</h2>
              <span className="badge badge-info">{visitors.length} Total</span>
            </div>

            {visitors.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <p className="text-gray-600">No visitors registered yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      visitor.checked_in
                        ? 'border-success bg-green-50'
                        : 'border-gray-200 bg-white hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-slate">{visitor.name}</h3>
                          <span className={`badge ${getRoleBadge(visitor.role)}`}>
                            {visitor.role.toUpperCase()}
                          </span>
                          {visitor.checked_in && (
                            <span className="badge badge-success">
                              ✓ Checked In
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {visitor.email}
                          </p>
                          {visitor.phone && (
                            <p className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              {visitor.phone}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Registered: {formatDateTime(visitor.registered_at)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCheckIn(visitor)}
                        className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all ${
                          visitor.checked_in
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-success hover:bg-green-600 text-white'
                        }`}
                      >
                        {visitor.checked_in ? 'Cancel' : 'Check In'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default VisitorRegistration
