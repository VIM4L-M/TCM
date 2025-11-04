import React, { useMemo, useState } from 'react'

// Skeleton page for Spirit scoring system with categories and auto total
const defaultCategories = [
  { id: 'rules', label: 'Rules Knowledge & Use' },
  { id: 'fouls', label: 'Fouls & Body Contact' },
  { id: 'fair', label: 'Fair-Mindedness' },
  { id: 'attitude', label: 'Positive Attitude & Self-Control' },
  { id: 'comm', label: 'Communication' },
]

const Spirit = () => {
  const [scores, setScores] = useState({ rules: 2, fouls: 2, fair: 2, attitude: 2, comm: 2 })
  const [comments, setComments] = useState('')

  const total = useMemo(() => Object.values(scores).reduce((a,b) => a + Number(b || 0), 0), [scores])

  const handleChange = (id, value) => {
    const v = Math.max(0, Math.min(4, Number(value)))
    setScores(prev => ({ ...prev, [id]: v }))
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">Spirit Score (Demo)</h1>
      <p className="text-gray-600 mb-6">Rate your opponent for this match. Each category ranges from 0 to 4 (2 = good). Max total = 20.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {defaultCategories.map(cat => (
            <div key={cat.id} className="p-4 rounded-lg border border-gray-200 bg-white">
              <label className="block font-semibold text-gray-800 mb-2">{cat.label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={1}
                  value={scores[cat.id]}
                  onChange={(e) => handleChange(cat.id, e.target.value)}
                  className="w-full"
                />
                <div className="w-12 text-center font-mono font-bold">{scores[cat.id]}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white flex flex-col">
          <div className="mb-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-4xl font-mono font-bold">{total}</div>
          </div>
          <label className="label-field">Comments & Feedback</label>
          <textarea className="textarea-field flex-1" placeholder="Share any feedback" value={comments} onChange={(e) => setComments(e.target.value)} />
          <div className="mt-4 flex gap-3">
            <button className="btn-secondary flex-1">Save as Draft</button>
            <button className="btn-primary flex-1">Submit Score</button>
          </div>
          <p className="text-xs text-gray-500 mt-3">Submission is required before your next match.</p>
        </div>
      </div>
    </div>
  )
}

export default Spirit
