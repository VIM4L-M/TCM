import React from 'react'

const DemoBanner = ({ onDismiss }) => {
  return (
    <div className="bg-gold text-white px-4 py-3 shadow-md mb-6 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="font-semibold">Demo Mode</p>
          <p className="text-sm text-white/90">No backend connected — using seed data. Changes won't persist.</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default DemoBanner
