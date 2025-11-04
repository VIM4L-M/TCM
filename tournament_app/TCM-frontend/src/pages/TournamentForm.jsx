import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTournament, createTournament, updateTournament } from '../api'
import { seedTournaments, generateId } from '../data/seed'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import FieldManager from '../components/FieldManager'
import SponsorManager from '../components/SponsorManager'
import SnapshotList from '../components/SnapshotList'
import TeamManager from '../components/TeamManager'

const TournamentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const { toasts, showToast, removeToast } = useToast()

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    rules: '',
    start_date: '',
    end_date: '',
    timezone: 'America/New_York',
    location: '',
    max_teams: 16,
    registration_close: '',
    status: 'draft',
    is_published: false,
    sponsors: [],
    fields: [],
    teams: [],
    tournament_format: 'single_elimination', // single_elimination, double_elimination, round_robin
    stats: {
      teams_registered: 0,
      matches_scheduled: 0
    }
  })

  useEffect(() => {
    if (isEditMode) {
      loadTournament()
    }
  }, [id])

  const loadTournament = async () => {
    setLoading(true)
    let data = await fetchTournament(id)
    
    if (!data) {
      // Fallback to localStorage first (for newly created tournaments in demo mode)
      const savedTournaments = localStorage.getItem('demo_tournaments')
      if (savedTournaments) {
        try {
          const tournaments = JSON.parse(savedTournaments)
          data = tournaments.find(t => t.id === id)
        } catch (e) {
          console.error('Failed to parse localStorage:', e)
        }
      }
      
      // If still not found, check seed data
      if (!data) {
        data = seedTournaments.find(t => t.id === id)
      }
    }

    if (data) {
      // Convert ISO dates to datetime-local format
      setFormData({
        ...data,
        start_date: data.start_date ? data.start_date.slice(0, 16) : '',
        end_date: data.end_date ? data.end_date.slice(0, 16) : '',
        registration_close: data.registration_close ? data.registration_close.slice(0, 16) : '',
        stats: data.stats || {
          teams_registered: 0,
          matches_scheduled: 0,
          fields_count: data.fields?.length || 0
        }
      })
    } else {
      showToast('Tournament not found', 'error')
      navigate('/tournaments')
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Validation
    if (!formData.title.trim()) {
      showToast('Title is required', 'error')
      setSaving(false)
      return
    }

    if (!formData.slug.trim()) {
      showToast('Slug is required', 'error')
      setSaving(false)
      return
    }

    // Prepare data for API
    const payload = {
      ...formData,
      // Backend expects date-only format (YYYY-MM-DD), not full ISO datetime
      start_date: formData.start_date ? formData.start_date.split('T')[0] : null,
      end_date: formData.end_date ? formData.end_date.split('T')[0] : null,
      // Remove fields that don't exist in backend model
      registration_close: undefined,
      stats: undefined,
      // Keep only the fields backend expects
      status: formData.status ? formData.status.toUpperCase() : 'DRAFT',
    }

    try {
      if (isEditMode) {
        const result = await updateTournament(id, payload)
        showToast('Tournament updated successfully', 'success')
      } else {
        const newTournament = await createTournament(payload)
        console.log('New tournament created:', newTournament)
        showToast('Tournament created successfully', 'success')
      }
      
      setSaving(false)
      
      // Navigate back to tournaments after short delay
      setTimeout(() => {
        navigate('/tournaments', { replace: true })
      }, 1000)
      
    } catch (err) {
      console.error('Save tournament failed:', err)
      showToast(err.message || 'Failed to save tournament', 'error')
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Discard changes and return to dashboard?')) {
      navigate('/tournaments')
    }
  }

  const autoGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading tournament..." />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate mb-2">
          {isEditMode ? 'Edit Tournament' : 'Create Tournament'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update tournament details and configuration'
            : 'Set up a new tournament with all required information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Tournament Title *</label>
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="e.g., TCA Championship 2025"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">URL Slug *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  className="input-field flex-1"
                  placeholder="e.g., tca-championship-2025"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={autoGenerateSlug}
                >
                  Auto Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Description</label>
              <textarea
                name="description"
                className="textarea-field"
                placeholder="Brief description of the tournament..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Rules & Regulations</label>
              <textarea
                name="rules"
                className="textarea-field"
                placeholder="Tournament rules and regulations..."
                value={formData.rules}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate mb-4">Schedule & Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Start Date & Time *</label>
              <input
                type="datetime-local"
                name="start_date"
                className="input-field"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label-field">End Date & Time *</label>
              <input
                type="datetime-local"
                name="end_date"
                className="input-field"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label-field">Timezone</label>
              <select
                name="timezone"
                className="select-field"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label className="label-field">Registration Close Date</label>
              <input
                type="datetime-local"
                name="registration_close"
                className="input-field"
                value={formData.registration_close}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Location *</label>
              <input
                type="text"
                name="location"
                className="input-field"
                placeholder="e.g., Madison Square Garden, New York"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label-field">Maximum Teams</label>
              <input
                type="number"
                name="max_teams"
                className="input-field"
                min="2"
                max="256"
                value={formData.max_teams}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label-field">Tournament Format</label>
              <select
                name="tournament_format"
                className="select-field"
                value={formData.tournament_format || 'single_elimination'}
                onChange={handleChange}
              >
                <option value="single_elimination">Single Elimination</option>
                <option value="double_elimination">Double Elimination</option>
                <option value="round_robin">Round Robin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Affects how matches are calculated
              </p>
            </div>
          </div>
        </div>

        {/* Note about Team Registration */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Team Registration Process</h3>
              <p className="text-sm text-blue-800">
                Teams will apply for this tournament through their player dashboards. You can review and approve team applications after publishing the tournament. Maximum {formData.max_teams} teams can be accepted.
              </p>
            </div>
          </div>
        </div>

        {/* Fields Management */}
        <FieldManager
          fields={formData.fields}
          onChange={(fields) => setFormData(prev => ({ ...prev, fields }))}
        />

        {/* Sponsors Management */}
        <SponsorManager
          sponsors={formData.sponsors}
          onChange={(sponsors) => setFormData(prev => ({ ...prev, sponsors }))}
        />

        {/* Publishing Options */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate mb-4">Publishing</h2>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              className="w-5 h-5 text-primary focus:ring-primary rounded"
              checked={formData.is_published}
              onChange={handleChange}
            />
            <div>
              <span className="font-semibold text-slate">Publish Tournament</span>
              <p className="text-sm text-gray-600">
                Make this tournament visible to the public
              </p>
            </div>
          </label>
        </div>

        {/* Snapshots (only in edit mode) */}
        {isEditMode && <SnapshotList tournamentId={id} />}

        {/* Form Actions */}
        <div className="flex gap-4 sticky bottom-4 bg-surface/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary flex-1"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-cta flex-1 flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Tournament</>
            )}
          </button>
        </div>
      </form>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default TournamentForm
