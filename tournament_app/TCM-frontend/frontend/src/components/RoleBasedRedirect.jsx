import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RoleBasedRedirect = () => {
  const { user } = useAuth()

  // Redirect admins/directors to tournament management
  if (user?.is_staff || user?.profile?.role === 'DIRECTOR') {
    return <Navigate to="/tournaments" replace />
  }

  // Redirect regular users to player dashboard
  return <Navigate to="/dashboard" replace />
}

export default RoleBasedRedirect
