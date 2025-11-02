import React from 'react'

const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin`} />
      {message && <p className="text-slate text-sm font-medium">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
