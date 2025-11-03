import React from 'react'
// import { generateId } from '../data/seed'

const SponsorManager = ({ sponsors = [], onChange }) => {
  const addSponsor = () => {
    const newSponsor = {
      id: generateId(),
      name: '',
      url: '',
      logo_url: ''
    }
    onChange([...sponsors, newSponsor])
  }

  const updateSponsor = (id, updates) => {
    onChange(sponsors.map(sponsor => 
      sponsor.id === id ? { ...sponsor, ...updates } : sponsor
    ))
  }

  const removeSponsor = (id) => {
    if (confirm('Remove this sponsor?')) {
      onChange(sponsors.filter(sponsor => sponsor.id !== id))
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate">Sponsors</h2>
          <p className="text-sm text-gray-600">Add tournament sponsors and partners</p>
        </div>
        <button
          type="button"
          onClick={addSponsor}
          className="btn-secondary"
        >
          + Add Sponsor
        </button>
      </div>

      {sponsors.length === 0 ? (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-gray-600">No sponsors added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gold transition-colors bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSponsor(sponsor.id)}
                  className="text-accent-coral hover:text-red-600 transition-colors"
                  aria-label="Remove sponsor"
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
                <div>
                  <label className="label-field">Sponsor Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Tech Corp"
                    value={sponsor.name}
                    onChange={(e) => updateSponsor(sponsor.id, { name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Website URL</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com"
                    value={sponsor.url}
                    onChange={(e) => updateSponsor(sponsor.id, { url: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label-field">Logo URL</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://example.com/logo.png"
                    value={sponsor.logo_url}
                    onChange={(e) => updateSponsor(sponsor.id, { logo_url: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Direct URL to sponsor logo image
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SponsorManager
