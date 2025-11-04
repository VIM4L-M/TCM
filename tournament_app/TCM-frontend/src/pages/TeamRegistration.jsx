import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTournament, registerTeam } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { seedTournaments } from '../data/seed'

const TeamRegistration = () => {
  const { tournamentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toasts, showToast, removeToast } = useToast()
  
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  
  const [formData, setFormData] = useState({
    team_name: '',
    captain_name: user?.username || '',
    contact_email: user?.email || '',
    contact_phone: '',
    players: [
      { name: '', jersey_number: '', position: '' },
    ]
  })

  useEffect(() => {
    loadTournament()
  }, [tournamentId])

  const loadTournament = async () => {
    setLoading(true)
    try {
      const data = await fetchTournament(tournamentId)
      if (data) {
        setTournament(data)
        setDemoMode(false)
      } else {
        // Try to load from seed data
        const seedTournament = seedTournaments.find(t => t.id === tournamentId || t.id.toString() === tournamentId)
        if (seedTournament) {
          setTournament(seedTournament)
          setDemoMode(true)
        } else {
          showToast('Tournament not found', 'error')
          navigate('/dashboard')
        }
      }
    } catch (error) {
      // Try to load from seed data on error
      const seedTournament = seedTournaments.find(t => t.id === tournamentId || t.id.toString() === tournamentId)
      if (seedTournament) {
        setTournament(seedTournament)
        setDemoMode(true)
      } else {
        showToast('Failed to load tournament', 'error')
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlayerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }))
  }

  const addPlayer = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players, { name: '', jersey_number: '', position: '' }]
    }))
  }

  const removePlayer = (index) => {
    if (formData.players.length > 1) {
      setFormData(prev => ({
        ...prev,
        players: prev.players.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validation
    if (!formData.team_name.trim()) {
      showToast('Team name is required', 'error')
      setSubmitting(false)
      return
    }

    if (!formData.captain_name.trim()) {
      showToast('Captain name is required', 'error')
      setSubmitting(false)
      return
    }

    if (!formData.contact_email.trim()) {
      showToast('Contact email is required', 'error')
      setSubmitting(false)
      return
    }

    // Filter out empty players
    const validPlayers = formData.players.filter(p => p.name.trim())
    
    if (validPlayers.length < 1) {
      showToast('At least 1 player is required', 'error')
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        name: formData.team_name,
        captain_name: formData.captain_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        players: validPlayers
      }

      if (demoMode) {
        // Store team in localStorage for demo mode
        const createdTeam = {
          id: `team-${Date.now()}`,
          tournament_id: tournamentId,
          ...payload,
          created_at: new Date().toISOString(),
          created_by: user?.username || 'Captain',
          status: 'pending'
        }
        
        const existingTeams = JSON.parse(localStorage.getItem('created_teams') || '[]')
        existingTeams.push(createdTeam)
        localStorage.setItem('created_teams', JSON.stringify(existingTeams))
        
        showToast('Team created successfully! (Demo Mode)', 'success')
      } else {
        await registerTeam(tournamentId, payload)
        showToast('Team registered successfully! Awaiting admin approval.', 'success')
      }
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Team registration failed:', error)
      showToast(error.message || 'Failed to register team', 'error')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading tournament..." />
      </div>
    )
  }

  if (!tournament) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-800 font-medium">Demo Mode</span>
            <span className="text-blue-600 ml-2">- Team will be saved locally</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate mb-2">Create Team</h1>
        <p className="text-gray-600">
          Create your team for <span className="font-semibold text-blue-600">{tournament.title || tournament.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate mb-4">Team Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label-field">Team Name *</label>
              <input
                type="text"
                name="team_name"
                className="input-field"
                placeholder="e.g., Thunder Strikers"
                value={formData.team_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Captain Name *</label>
                <input
                  type="text"
                  name="captain_name"
                  className="input-field"
                  value={formData.captain_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-field">Contact Phone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  className="input-field"
                  placeholder="+1 234 567 8900"
                  value={formData.contact_phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="label-field">Contact Email *</label>
              <input
                type="email"
                name="contact_email"
                className="input-field"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate">Team Players (Minimum 1)</h2>
            <button
              type="button"
              onClick={addPlayer}
              className="btn-secondary text-sm"
            >
              + Add Player
            </button>
          </div>

          <div className="space-y-4">
            {formData.players.map((player, index) => (
              <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Player Name"
                      className="input-field"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                      required={index < 5}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Jersey Number"
                      className="input-field"
                      value={player.jersey_number}
                      onChange={(e) => handlePlayerChange(index, 'jersey_number', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Position"
                      className="input-field"
                      value={player.position}
                      onChange={(e) => handlePlayerChange(index, 'position', e.target.value)}
                    />
                  </div>
                </div>

                {index >= 5 && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 p-2"
                    title="Remove player"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 mt-4">
            * First 5 players are required. You can add more players as substitutes.
          </p>
        </div>

        {/* Important Information */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Team Creation Process</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• As captain, you're creating a new team for this tournament</li>
                <li>• Players can join your team after it's created</li>
                <li>• Make sure all player information is accurate</li>
                <li>• You can add {tournament.max_players_per_team || 15} players to your team</li>
                <li>• Your team will be visible to other players once created</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 sticky bottom-4 bg-surface/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary flex-1"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-cta flex-1 flex items-center justify-center gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Team
              </>
            )}
          </button>
        </div>
      </form>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default TeamRegistration
