import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user_data')
      
      if (token && savedUser) {
        try {
          // First set user from localStorage immediately (no loading screen)
          const cachedUser = JSON.parse(savedUser)
          setUser(cachedUser)
          setLoading(false)
          
          // Then refresh from backend in background
          const userData = await api.getCurrentUser()
          setUser(userData)
          localStorage.setItem('user_data', JSON.stringify(userData))
        } catch (error) {
          console.error('Auth refresh failed:', error)
          // Only remove on 401, keep cached user data for network errors
          if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
            setUser(null)
            setLoading(false)
          }
          // Otherwise keep the cached user data (loading already set to false above)
        }
      } else if (token && !savedUser) {
        // Have token but no cached user, try to fetch
        try {
          const userData = await api.getCurrentUser()
          setUser(userData)
          localStorage.setItem('user_data', JSON.stringify(userData))
        } catch (error) {
          console.error('Auth fetch failed:', error)
          localStorage.removeItem('auth_token')
          setUser(null)
        }
        setLoading(false)
      } else {
        // No token or user data - not authenticated
        setLoading(false)
      }
    } catch (error) {
      console.error('Critical auth error:', error)
      // Clear everything on critical error
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      setUser(null)
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user_data', JSON.stringify(response.user))
      setUser(response.user)
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.register(userData)
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user_data', JSON.stringify(response.user))
      setUser(response.user)
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    window.location.href = '/login'
  }

  const isAdmin = () => {
    return user?.is_staff || user?.profile?.role === 'DIRECTOR' || user?.profile?.role === 'SCORING'
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
