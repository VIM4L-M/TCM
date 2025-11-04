import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchTournaments, deleteTournament, createSnapshot } from '../api'
import { seedTournaments } from '../data/seed'
import DemoBanner from '../components/DemoBanner'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([])
  const [filteredTournaments, setFilteredTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toasts, showToast, removeToast } = useToast()
  const location = useLocation()

  // Load tournaments on mount and when navigating back to this page
  useEffect(() => {
    loadTournaments()
  }, [location.pathname])

  // Save tournaments to localStorage whenever they change (for demo mode persistence)
  useEffect(() => {
    if (demoMode && tournaments.length > 0) {
      localStorage.setItem('demo_tournaments', JSON.stringify(tournaments))
    }
  }, [tournaments, demoMode])

  useEffect(() => {
    filterTournaments()
  }, [searchQuery, statusFilter, tournaments])

  const loadTournaments = async () => {
    setLoading(true)
    const data = await fetchTournaments()
    
    if (data === null) {
      // Backend unavailable, check localStorage first, then use seed data
      const savedTournaments = localStorage.getItem('demo_tournaments')
      if (savedTournaments) {
        try {
          setTournaments(JSON.parse(savedTournaments))
        } catch (e) {
          setTournaments([...seedTournaments])
        }
      } else {
        setTournaments([...seedTournaments])
      }
      setDemoMode(true)
    } else {
      setTournaments(data)
      setDemoMode(false)
        // Clear localStorage seed data when backend is available
        localStorage.removeItem('demo_tournaments')
    }
    
    setLoading(false)
  }

  const filterTournaments = () => {
    // Safety check: ensure tournaments is an array
    if (!Array.isArray(tournaments)) {
      setFilteredTournaments([])
      return
    }

    let filtered = [...tournaments]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.slug.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    setFilteredTournaments(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return

    const result = await deleteTournament(id)
    if (result.success) {
      setTournaments(prev => prev.filter(t => t.id !== id))
      showToast('Tournament deleted successfully', 'success')
    } else {
      showToast('Failed to delete tournament', 'error')
    }
  }

  const handlePublish = async (tournament) => {
    // Toggle between draft/active status and published state
    const newPublishState = !tournament.is_published
    const newStatus = newPublishState ? 'active' : 'draft'
    
    // Create updated tournament object with new values
    const updated = { 
      ...tournament, 
      is_published: newPublishState,
      status: newStatus,
      updated_at: new Date().toISOString()
    }
    
    // Update local state immediately for responsive UI
    setTournaments(prev => prev.map(t => t.id === tournament.id ? updated : t))
    
    // Update with backend (fire and forget, already updated UI)
    updateTournament(tournament.id, { 
      is_published: newPublishState,
      status: newStatus 
    })
    
    showToast(
      newPublishState ? 'Tournament published and activated' : 'Tournament unpublished and set to draft',
      'success'
    )
  }

  const handleCreateSnapshot = async (id) => {
    const description = prompt('Enter snapshot description (optional):')
    if (description === null) return // User cancelled

    const snapshot = await createSnapshot(id, description)
    showToast('Snapshot created successfully', 'success')
  }

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-info',
      active: 'badge-success',
      completed: 'badge-warning',
      cancelled: 'badge-danger'
    }
    return badges[status] || 'badge-info'
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading tournaments..." />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {demoMode && <DemoBanner onDismiss={() => setDemoMode(false)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate mb-2">Tournament Dashboard</h1>
          <p className="text-gray-600">Manage your tournaments and track key metrics</p>
        </div>
        <Link to="/tournaments/create" className="btn-cta mt-4 md:mt-0 text-center">
          + Create Tournament
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Search Tournaments</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, slug, or location..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
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
          </div>
          <div>
            <label className="label-field">Filter by Status</label>
            <select
              className="select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournament Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="card text-center py-12">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-semibold text-slate mb-2">No tournaments found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first tournament'}
          </p>
          <Link to="/tournaments/create" className="btn-cta inline-block">
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:scale-105 hover:shadow-xl hover:shadow-blue-100 hover:bg-gradient-to-br hover:from-blue-400 hover:via-sky-200 hover:to-cyan-100 transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold text-sky-600 mb-1">{tournament.title}</h2>
              <p className="text-gray-600 mb-2">{tournament.location}</p>
              <span className={`inline-block ${tournament.status === 'active' ? 'bg-green-100 text-green-700' : tournament.status === 'draft' ? 'bg-gray-200 text-gray-700' : tournament.status === 'completed' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'} text-sm font-semibold px-3 py-1 rounded-full mb-4`}>
                {tournament.status.toUpperCase()}
              </span>

              <div className="flex justify-around my-4">
                <div>
                  <span className="text-sky-500 font-bold text-lg">{tournament.stats?.teams_registered || 0}</span>
                  <p className="text-gray-500 text-sm">Teams</p>
                </div>
                <div>
                  <span className="text-sky-500 font-bold text-lg">{tournament.stats?.matches_scheduled || 0}</span>
                  <p className="text-gray-500 text-sm">Matches</p>
                </div>
                <div>
                  <span className="text-amber-500 font-bold text-lg">{tournament.stats?.fields_count || 0}</span>
                  <p className="text-gray-500 text-sm">Fields</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-4">
                <p><strong>Start:</strong> {formatDate(tournament.start_date)}</p>
                <p><strong>End:</strong> {formatDate(tournament.end_date)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/tournaments/edit/${tournament.id}`}
                  className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 ease-in-out text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handlePublish(tournament)}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 rounded-lg transition-all duration-200 ease-in-out text-center ${!tournament.is_published ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                >
                  {tournament.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleCreateSnapshot(tournament.id)}
                  className="bg-sky-500 hover:bg-sky-600 hover:shadow-md text-white font-semibold py-2 rounded-lg transition-all duration-200 ease-in-out text-center"
                >
                  📸 Snapshot
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 ease-in-out text-center"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default Dashboard
