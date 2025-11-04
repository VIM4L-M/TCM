import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchTournaments } from '../api'

const Layout = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout, isAdmin, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ active: 0, teams: 0, players: 0 })

  // Load stats - useEffect MUST be called before any early returns
  useEffect(() => {
    if (!loading && isAuthenticated()) {
      loadStats()
    }
  }, [location.pathname, loading])

  const loadStats = async () => {
    try {
      const tournaments = await fetchTournaments()
      if (tournaments && Array.isArray(tournaments)) {
        const active = tournaments.filter(t => t.status === 'PUBLISHED' || t.status === 'active').length
        const teams = tournaments.reduce((sum, t) => sum + (t.stats?.teams_registered || 0), 0)
        const players = tournaments.reduce((sum, t) => sum + (t.teams?.length || 0) * 7, 0)
        setStats({ active, teams, players })
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Define menu items based on user role
  const getNavItems = () => {
    // Check if user is admin
    const isUserAdmin = user?.is_staff || user?.profile?.role === 'DIRECTOR'
    const userRole = user?.profile?.role
    
    const commonItems = [
      { path: '/schedule', label: 'Schedule', icon: '🗓️' },
      { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
      { path: '/spirit', label: 'Spirit', icon: '✨' },
    ]

    const adminItems = [
      { path: '/tournaments', label: 'Tournaments', icon: '🏆' },
      { path: '/players', label: 'Players', icon: '👤' },
      { path: '/visitors', label: 'Visitors', icon: '👥' },
    ]

    const playerItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    ]
    
    const fanItems = [
      { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
    ]

    // Show admin items if user is staff (admin/director)
    if (isUserAdmin) {
      return [...adminItems, ...commonItems]
    }
    
    // Fan can only see leaderboard
    if (userRole === 'FAN') {
      return fanItems
    }
    
    // Players and Captains can see dashboard + common items
    return [...playerItems, ...commonItems]
  }

  const navItems = getNavItems()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-tournament-blue to-primary-dark rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-display font-bold text-gray-900 leading-none">TCM</h1>
                <p className="text-xs text-gray-500">Championship Manager</p>
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
              title="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Notifications" title="Notifications">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-live-orange rounded-full"></span>
            </button>
            
            {/* User Avatar */}
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-tournament-blue to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                <p className="text-xs text-gray-500">
                  {user?.is_staff ? 'Administrator' : user?.profile?.role || 'User'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">Main Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-tournament-blue text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-tournament-blue'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Quick Stats in Sidebar */}
          <div className="p-4 mt-8 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Stats</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active</span>
                <span className="text-sm font-bold text-tournament-blue">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Teams</span>
                <span className="text-sm font-bold text-success">{stats.teams}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Players</span>
                <span className="text-sm font-bold text-spirit-gold">{stats.players}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="lg:hidden fixed left-0 top-[73px] bottom-0 w-64 bg-white shadow-xl z-50 overflow-y-auto">
              <nav className="p-4 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">Main Menu</p>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-tournament-blue text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
