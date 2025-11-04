import React from 'react'
import { generateId } from '../data/seed'

const FieldManager = ({ fields = [], onChange }) => {
  const addField = () => {
    const newField = {
      id: generateId(),
      name: '',
      open_time: '09:00',
      close_time: '18:00',
      buffer_minutes: 15,
      scheduled_matches: 0
    }
    onChange([...fields, newField])
  }

  const updateField = (id, updates) => {
    onChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeField = (id) => {
    if (confirm('Remove this field?')) {
      onChange(fields.filter(field => field.id !== id))
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate">Playing Fields</h2>
          <p className="text-sm text-gray-600">Configure venues and their availability</p>
        </div>
        <button
          type="button"
          onClick={addField}
          className="btn-secondary"
        >
          + Add Field
        </button>
      </div>

      {fields.length === 0 ? (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-600 mb-3">No fields configured yet</p>
          <button
            type="button"
            onClick={addField}
            className="btn-cta"
          >
            Add Your First Field
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="text-accent-coral hover:text-red-600 transition-colors"
                  aria-label="Remove field"
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
                  <label className="label-field">Field Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Main Arena, Court A"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Open Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={field.open_time}
                    onChange={(e) => updateField(field.id, { open_time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Close Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={field.close_time}
                    onChange={(e) => updateField(field.id, { close_time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field">Buffer (minutes)</label>
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    max="120"
                    placeholder="15"
                    value={field.buffer_minutes}
                    onChange={(e) => updateField(field.id, { buffer_minutes: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Time between matches for setup/cleanup
                  </p>
                </div>

                <div className="flex items-end">
                  <div className="w-full">
                    <label className="label-field">Scheduled Matches</label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      placeholder="0"
                      value={field.scheduled_matches || 0}
                      onChange={(e) => updateField(field.id, { scheduled_matches: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of matches scheduled for this field
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FieldManager
