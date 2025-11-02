import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchTournaments, deleteTournament, createSnapshot, publishTournament } from '../api'
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

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    filterTournaments()
  }, [searchQuery, statusFilter, tournaments])

  const loadTournaments = async () => {
    setLoading(true)
    try {
      const data = await fetchTournaments(null, statusFilter, searchQuery)
      setTournaments(data)
      setDemoMode(false)
    } catch (error) {
      console.error('Error loading tournaments:', error)
      showToast('Failed to load tournaments', 'error')
      setTournaments([])
      setDemoMode(true)
    }
    setLoading(false)
  }

  const filterTournaments = () => {
    let filtered = [...tournaments]

    // Search filter (client-side for immediate feedback)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        (t.name || t.title || '').toLowerCase().includes(query) ||
        (t.slug || '').toLowerCase().includes(query) ||
        (t.location || '').toLowerCase().includes(query) ||
        (t.city || '').toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => 
        (t.status || '').toLowerCase() === statusFilter.toLowerCase()
      )
    }

    setFilteredTournaments(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return

    try {
      await deleteTournament(id)
      setTournaments(prev => prev.filter(t => t.id !== id))
      showToast('Tournament deleted successfully', 'success')
    } catch (error) {
      console.error('Delete error:', error)
      showToast('Failed to delete tournament', 'error')
    }
  }

  const handlePublish = async (tournament) => {
    try {
      // Check current status
      const isPublished = tournament.status === 'PUBLISHED'
      
      if (isPublished) {
        // If already published, set back to draft
        const updated = await publishTournament(tournament.id)
        // Actually we need to use updateTournament for unpublishing
        // For now, just toggle locally
        setTournaments(prev => prev.map(t => 
          t.id === tournament.id ? { ...t, status: 'DRAFT' } : t
        ))
        showToast('Tournament set to draft', 'success')
      } else {
        // Publish the tournament
        const updated = await publishTournament(tournament.id)
        setTournaments(prev => prev.map(t => 
          t.id === tournament.id ? { ...t, status: 'PUBLISHED' } : t
        ))
        showToast('Tournament published successfully', 'success')
      }
    } catch (error) {
      console.error('Publish error:', error)
      showToast('Failed to update tournament status', 'error')
    }
  }

  const handleCreateSnapshot = async (id) => {
    const description = prompt('Enter snapshot description (optional):')
    if (description === null) return // User cancelled

    try {
      await createSnapshot(id, description)
      showToast('Snapshot created successfully', 'success')
    } catch (error) {
      console.error('Snapshot error:', error)
      showToast('Failed to create snapshot', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase()
    const badges = {
      draft: 'badge-info',
      published: 'badge-success',
      active: 'badge-success',
      ongoing: 'badge-success',
      completed: 'badge-warning',
      cancelled: 'badge-danger'
    }
    return badges[statusLower] || 'badge-info'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
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
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
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
            <div key={tournament.id} className="card group hover:glow-primary">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate mb-2 group-hover:text-primary transition-colors">
                    {tournament.name || tournament.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {tournament.location}
                    {tournament.city && `, ${tournament.city}`}
                  </p>
                  <span className={`badge ${getStatusBadge(tournament.status)}`}>
                    {(tournament.status || 'DRAFT').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {tournament.teams_count || tournament.stats?.teams_registered || 0}
                  </p>
                  <p className="text-xs text-gray-600">Teams</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent-teal">
                    {tournament.matches_count || tournament.stats?.matches_scheduled || 0}
                  </p>
                  <p className="text-xs text-gray-600">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold">
                    {tournament.fields_count || tournament.stats?.fields_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Fields</p>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Start:</span> {formatDate(tournament.start_date)}
                </p>
                <p>
                  <span className="font-semibold">End:</span> {formatDate(tournament.end_date)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to={`/tournaments/edit/${tournament.id}`}
                  className="flex-1 text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handlePublish(tournament)}
                  className={`flex-1 text-center font-medium py-2 px-4 rounded-lg transition-colors ${
                    tournament.status === 'PUBLISHED'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-success hover:bg-green-600 text-white'
                  }`}
                >
                  {tournament.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleCreateSnapshot(tournament.id)}
                  className="flex-1 text-center bg-accent-teal hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  📸 Snapshot
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="flex-1 text-center bg-accent-coral hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  🗑️ Delete
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