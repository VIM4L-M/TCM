import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { seedTournaments } from '../data/seed'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const JoinTeam = () => {
  const { tournamentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState([])
  const [filteredTeams, setFilteredTeams] = useState([])
  const [joinedTeam, setJoinedTeam] = useState(null)
  const { toasts, showToast, removeToast } = useToast()

  useEffect(() => {
    // Load tournament from seed data
    const tournamentData = seedTournaments.find(t => t.id === tournamentId)
    if (tournamentData) {
      setTournament(tournamentData)
      setTeams(tournamentData.teams || [])
      setFilteredTeams(tournamentData.teams || [])
    }
  }, [tournamentId])

  useEffect(() => {
    // Filter teams based on search query
    if (searchQuery.trim() === '') {
      setFilteredTeams(teams)
    } else {
      const filtered = teams.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.captain.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredTeams(filtered)
    }
  }, [searchQuery, teams])

  const handleJoinTeam = (team) => {
    // Store joined team info
    setJoinedTeam(team)
    
    // Store in localStorage for persistence
    const joinedTeams = JSON.parse(localStorage.getItem('joined_teams') || '{}')
    joinedTeams[tournamentId] = {
      teamId: team.id,
      teamName: team.name,
      captain: team.captain,
      joinedAt: new Date().toISOString(),
      userId: user?.username
    }
    localStorage.setItem('joined_teams', JSON.stringify(joinedTeams))
    
    showToast(`Successfully joined ${team.name}!`, 'success')
    
    // Redirect back to tournament details after 2 seconds
    setTimeout(() => {
      navigate(`/tournaments/${tournamentId}`)
    }, 2000)
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold text-slate mb-4">Tournament Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-cta">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (joinedTeam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center py-12 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate mb-4">Team Joined Successfully!</h2>
          <p className="text-gray-600 mb-2">You have joined</p>
          <p className="text-2xl font-bold text-sky-600 mb-6">{joinedTeam.name}</p>
          <p className="text-gray-600 mb-8">
            Captain: <span className="font-semibold">{joinedTeam.captain}</span>
          </p>
          <p className="text-sm text-gray-500">Redirecting to tournament details...</p>
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sky-600 hover:text-sky-700 font-medium mb-4 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-4xl font-bold text-slate mb-2">Join Team</h1>
        <p className="text-gray-600">Search and join an existing team for {tournament.title}</p>
      </div>

      {/* Search Box */}
      <div className="card mb-6">
        <label className="label-field">Search Teams</label>
        <div className="relative">
          <input
            type="text"
            className="input-field pl-12"
            placeholder="Search by team name or captain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Teams List */}
      <div className="card">
        <h2 className="text-2xl font-bold text-slate mb-4">Available Teams</h2>
        
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
            <p className="text-gray-500 mb-2">No teams found</p>
            <p className="text-sm text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-sky-400 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate mb-2">{team.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Captain:</span> {team.captain}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {team.contact_email}
                      </p>
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {team.contact_phone}
                      </p>
                      {team.spirit_score && (
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">Spirit Score:</span> {team.spirit_score}/100
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinTeam(team)}
                    className="ml-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Join Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default JoinTeam
