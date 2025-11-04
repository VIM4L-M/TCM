import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { seedTournaments } from '../data/seed'

const TournamentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  useEffect(() => {
    loadTournamentDetails()
  }, [id])

  const loadTournamentDetails = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://localhost:8000/api/tournaments/${id}/`, {
        headers: {
          'Authorization': token ? `Token ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load tournament details')
      }

      const data = await response.json()
      setTournament(data)
      setDemoMode(false)
    } catch (error) {
      console.error('Error loading tournament from backend:', error)
      // Try to load from seed data
      const seedTournament = seedTournaments.find(t => t.id === id || t.id.toString() === id)
      if (seedTournament) {
        setTournament(seedTournament)
        setDemoMode(true)
      } else {
        showToast('Tournament not found', 'error')
        setTimeout(() => navigate('/dashboard'), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-gray-200 text-gray-700'
      case 'active':
      case 'published':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-amber-100 text-amber-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  const canRegisterTeam = () => {
    if (!user || !tournament) return false
    
    // Check if tournament is published
    if (tournament.status !== 'PUBLISHED') return false
    
    // Check user role - PLAYER, CAPTAIN can register
    const allowedRoles = ['PLAYER', 'CAPTAIN']
    return allowedRoles.includes(user.role?.toUpperCase())
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold text-slate mb-4">Tournament Not Found</h2>
          <p className="text-gray-600 mb-6">The tournament you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="btn-cta inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate mb-2">{tournament.name || tournament.title}</h1>
          <p className="text-gray-600">Complete tournament information and registration</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tournament Info Card */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate mb-2">Tournament Information</h2>
                <span className={`inline-block ${getStatusColor(tournament.status)} text-sm font-semibold px-4 py-1.5 rounded-full`}>
                  {tournament.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="text-lg font-semibold text-slate">{formatDate(tournament.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="text-lg font-semibold text-slate">{formatDate(tournament.end_date)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-lg font-semibold text-slate">{tournament.location || 'TBD'}</p>
              </div>

              {tournament.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{tournament.description}</p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-500 mb-1">
                    {tournament.stats?.teams_registered || 0}
                  </div>
                  <div className="text-sm text-gray-600">Teams Registered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sky-500 mb-1">
                    {tournament.stats?.matches_scheduled || 0}
                  </div>
                  <div className="text-sm text-gray-600">Matches Scheduled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500 mb-1">
                    {tournament.stats?.fields_count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Playing Fields</div>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Teams Section */}
          <div className="card mt-6">
            <h3 className="text-xl font-bold text-slate mb-4">Registered Teams</h3>
            {tournament.stats?.teams_registered > 0 ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  {tournament.stats.teams_registered} team(s) have registered for this tournament.
                </p>
                {/* TODO: Add list of registered teams when API is ready */}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-3"
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
                <p className="text-gray-500">No teams registered yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-xl font-bold text-slate mb-4">Actions</h3>
            
            {canRegisterTeam() ? (
              <div className="space-y-3">
                <Link
                  to={`/tournaments/${tournament.id}/register`}
                  className="btn-cta w-full text-center block"
                >
                  🎯 Register Team
                </Link>
                <p className="text-sm text-gray-600">
                  Register your team to participate in this tournament
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tournament.status !== 'PUBLISHED' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This tournament is not open for registration yet.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      ℹ️ Team registration is available for players and captains.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Admin Actions */}
            {user?.role === 'DIRECTOR' && (
              <div className="mt-6 pt-6 border-t space-y-3">
                <h4 className="font-semibold text-slate mb-3">Admin Actions</h4>
                <Link
                  to={`/tournaments/edit/${tournament.id}`}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 w-full text-center block"
                >
                  ✏️ Edit Tournament
                </Link>
                <Link
                  to="/schedule"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 w-full text-center block"
                >
                  📅 Manage Schedule
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <h4 className="font-semibold text-slate mb-3">Quick Links</h4>
              <Link
                to="/schedule"
                className="flex items-center text-sky-600 hover:text-sky-700 text-sm"
              >
                <span className="mr-2">📅</span>
                View Schedule
              </Link>
              <Link
                to="/leaderboard"
                className="flex items-center text-sky-600 hover:text-sky-700 text-sm"
              >
                <span className="mr-2">🏆</span>
                Leaderboard
              </Link>
              <Link
                to="/spirit"
                className="flex items-center text-sky-600 hover:text-sky-700 text-sm"
              >
                <span className="mr-2">⭐</span>
                Spirit Scores
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default TournamentDetails
