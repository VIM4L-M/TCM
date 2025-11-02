import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTournament, createTournament, updateTournament } from '../api'
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
    name: '',
    slug: '',
    description: '',
    rules: '',
    start_date: '',
    end_date: '',
    location: '',
    city: '',
    state: '',
    country: '',
    status: 'DRAFT',
    sponsors: [],
    fields: [],
    teams: [],
  })

  useEffect(() => {
    if (isEditMode) {
      loadTournament()
    }
  }, [id])

  const loadTournament = async () => {
    setLoading(true)
    try {
      const data = await fetchTournament(id)
      
      if (data) {
        // Convert Django data to form format
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          rules: data.rules || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          location: data.location || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          status: data.status || 'DRAFT',
          sponsors: data.sponsors || [],
          fields: data.fields || [],
          teams: data.teams || [],
        })
      } else {
        showToast('Tournament not found', 'error')
        navigate('/tournaments')
      }
    } catch (error) {
      console.error('Error loading tournament:', error)
      showToast('Failed to load tournament', 'error')
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
    if (!formData.name.trim()) {
      showToast('Tournament name is required', 'error')
      setSaving(false)
      return
    }

    if (!formData.location.trim()) {
      showToast('Location is required', 'error')
      setSaving(false)
      return
    }

    if (!formData.start_date) {
      showToast('Start date is required', 'error')
      setSaving(false)
      return
    }

    if (!formData.end_date) {
      showToast('End date is required', 'error')
      setSaving(false)
      return
    }

    // Prepare data for Django API
    const payload = {
      name: formData.name,
      location: formData.location,
      city: formData.city || '',
      state: formData.state || '',
      country: formData.country || '',
      start_date: formData.start_date,
      end_date: formData.end_date,
      status: formData.status || 'DRAFT',
      description: formData.description || '',
      rules: formData.rules || '',
    }

    try {
      if (isEditMode) {
        await updateTournament(id, payload)
        showToast('Tournament updated successfully', 'success')
      } else {
        await createTournament(payload)
        showToast('Tournament created successfully', 'success')
      }
      
      setTimeout(() => {
        navigate('/tournaments')
      }, 1000)
    } catch (error) {
      console.error('Error saving tournament:', error)
      showToast(error.message || 'Failed to save tournament', 'error')
    }
    
    setSaving(false)
  }

  const handleCancel = () => {
    if (confirm('Discard changes and return to dashboard?')) {
      navigate('/tournaments')
    }
  }

  const autoGenerateSlug = () => {
    const slug = formData.name
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
              <label className="label-field">Tournament Name *</label>
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="e.g., Summer League 2025"
                value={formData.name}
                onChange={handleChange}
                required
              />
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
              <label className="label-field">Start Date *</label>
              <input
                type="date"
                name="start_date"
                className="input-field"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label-field">End Date *</label>
              <input
                type="date"
                name="end_date"
                className="input-field"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Location/Venue *</label>
              <input
                type="text"
                name="location"
                className="input-field"
                placeholder="e.g., Community Sports Complex"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label-field">City</label>
              <input
                type="text"
                name="city"
                className="input-field"
                placeholder="e.g., Los Angeles"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label-field">State/Province</label>
              <input
                type="text"
                name="state"
                className="input-field"
                placeholder="e.g., California"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Country</label>
              <input
                type="text"
                name="country"
                className="input-field"
                placeholder="e.g., USA"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Team Registration */}
        {isEditMode && (
          <TeamManager
            tournamentId={id}
            teams={formData.teams || []}
            onChange={(teams) => setFormData(prev => ({ ...prev, teams }))}
          />
        )}

        {/* Fields Management */}
        {isEditMode && (
          <FieldManager
            tournamentId={id}
            fields={formData.fields || []}
            onChange={(fields) => setFormData(prev => ({ ...prev, fields }))}
          />
        )}

        {/* Sponsors Management */}
        <SponsorManager
          sponsors={formData.sponsors || []}
          onChange={(sponsors) => setFormData(prev => ({ ...prev, sponsors }))}
        />

        {/* Status Selection */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate mb-4">Status</h2>
          
          <div>
            <label className="label-field">Tournament Status</label>
            <select
              name="status"
              className="select-field"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <p className="text-sm text-gray-600 mt-2">
              {formData.status === 'DRAFT' && 'Tournament is not visible to public'}
              {formData.status === 'PUBLISHED' && 'Tournament is visible and accepting registrations'}
              {formData.status === 'ONGOING' && 'Tournament is currently in progress'}
              {formData.status === 'COMPLETED' && 'Tournament has finished'}
              {formData.status === 'CANCELLED' && 'Tournament has been cancelled'}
            </p>
          </div>
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