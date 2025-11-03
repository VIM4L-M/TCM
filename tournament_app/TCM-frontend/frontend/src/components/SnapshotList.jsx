import React, { useState, useEffect } from 'react'
import { fetchSnapshots, createSnapshot } from '../api'
// import { seedSnapshots } from '../data/seed'
import LoadingSpinner from './LoadingSpinner'

const SnapshotList = ({ tournamentId }) => {
  const [snapshots, setSnapshots] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadSnapshots()
  }, [tournamentId])

  const loadSnapshots = async () => {
    setLoading(true)
    let data = await fetchSnapshots(tournamentId)
    
    if (data === null) {
      // Fallback to seed data filtered by tournament ID
      data = seedSnapshots.filter(s => s.tournament_id === tournamentId)
    }
    
    setSnapshots(data)
    setLoading(false)
  }

  const handleCreateSnapshot = async () => {
    const description = prompt('Enter snapshot description (optional):')
    if (description === null) return // User cancelled

    setCreating(true)
    const snapshot = await createSnapshot(tournamentId, description)
    setSnapshots(prev => [snapshot, ...prev])
    setCreating(false)
  }

  const handleDownload = (snapshot) => {
    // Simulate JSON download
    const data = {
      snapshot_id: snapshot.id,
      tournament_id: snapshot.tournament_id,
      created_at: snapshot.created_at,
      description: snapshot.description,
      data: {
        // TODO: Backend should include full tournament state here
        message: 'Snapshot data would be included here'
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snapshot-${snapshot.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate">Historical Snapshots</h2>
          <p className="text-sm text-gray-600">Save and restore tournament state at different points in time</p>
        </div>
        <button
          type="button"
          onClick={handleCreateSnapshot}
          className="btn-secondary flex items-center gap-2"
          disabled={creating}
        >
          {creating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate/30 border-t-slate rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              📸 Create Snapshot
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-8">
          <LoadingSpinner size="sm" message="Loading snapshots..." />
        </div>
      ) : snapshots.length === 0 ? (
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
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-600 mb-3">No snapshots created yet</p>
          <p className="text-sm text-gray-500">
            Create snapshots to preserve tournament state for later reference
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-accent-teal transition-colors bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="font-semibold text-slate">
                        {snapshot.description || 'Snapshot'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(snapshot.created_at)}
                        {snapshot.created_by && ` • by ${snapshot.created_by}`}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                    ID: {snapshot.id}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(snapshot)}
                  className="ml-4 bg-accent-teal hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SnapshotList
