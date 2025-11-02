import React, { useEffect } from 'react'
import { generateId } from '../data/seed'

const TeamManager = ({ teams = [], onChange, maxTeams, tournamentFormat, onStatsUpdate }) => {
  // Calculate matches whenever teams or format changes
  useEffect(() => {
    const teamsCount = teams.length
    let matchesCount = 0

    if (teamsCount >= 2) {
      switch (tournamentFormat) {
        case 'single_elimination':
          // Single elimination: n-1 matches
          matchesCount = teamsCount - 1
          break
        case 'double_elimination':
          // Double elimination: approximately 2n-2 matches
          matchesCount = (teamsCount * 2) - 2
          break
        case 'round_robin':
          // Round robin: n(n-1)/2 matches
          matchesCount = (teamsCount * (teamsCount - 1)) / 2
          break
        default:
          matchesCount = teamsCount - 1
      }
    }

    // Update parent component with calculated stats
    if (onStatsUpdate) {
      onStatsUpdate({
        teams_registered: teamsCount,
        matches_scheduled: matchesCount
      })
    }
  }, [teams, tournamentFormat, onStatsUpdate])

  const addTeam = () => {
    if (teams.length >= maxTeams) {
      alert(`Maximum ${maxTeams} teams allowed`)
      return
    }

    const newTeam = {
      id: generateId(),
      name: '',
      captain: '',
      contact_email: '',
      contact_phone: ''
    }
    onChange([...teams, newTeam])
  }

  const updateTeam = (id, updates) => {
    onChange(teams.map(team => 
      team.id === id ? { ...team, ...updates } : team
    ))
  }

  const removeTeam = (id) => {
    if (confirm('Remove this team?')) {
      onChange(teams.filter(team => team.id !== id))
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate">Team Registration</h2>
          <p className="text-sm text-gray-600">
            Registered teams: <span className="font-semibold text-primary">{teams.length}</span> / {maxTeams}
          </p>
        </div>
        <button
          type="button"
          onClick={addTeam}
          className="btn-secondary"
          disabled={teams.length >= maxTeams}
        >
          + Add Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-gray-600 mb-3">No teams registered yet</p>
          <button
            type="button"
            onClick={addTeam}
            className="btn-cta"
          >
            Add Your First Team
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate">
                    {team.name || 'Unnamed Team'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeTeam(team.id)}
                  className="text-accent-coral hover:text-red-600 transition-colors"
                  aria-label="Remove team"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-field">Team Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Thunder Strikers"
                    value={team.name}
                    onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Team Captain</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Captain name"
                    value={team.captain}
                    onChange={(e) => updateTeam(team.id, { captain: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Contact Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="team@example.com"
                    value={team.contact_email}
                    onChange={(e) => updateTeam(team.id, { contact_email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Contact Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+1-555-0123"
                    value={team.contact_phone}
                    onChange={(e) => updateTeam(team.id, { contact_phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {teams.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <p className="text-sm text-blue-800 font-semibold">Teams Registered</p>
            <p className="text-3xl font-bold text-blue-600">{teams.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-semibold">Matches to Schedule</p>
            <p className="text-3xl font-bold text-blue-600">
              {tournamentFormat === 'single_elimination' && teams.length - 1}
              {tournamentFormat === 'double_elimination' && (teams.length * 2) - 2}
              {tournamentFormat === 'round_robin' && (teams.length * (teams.length - 1)) / 2}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamManager
