import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PlayerDashboard from './pages/PlayerDashboard'
import TournamentForm from './pages/TournamentForm'
import TournamentDetails from './pages/TournamentDetails'
import TeamRegistration from './pages/TeamRegistration'
import JoinTeam from './pages/JoinTeam'
import VisitorRegistration from './pages/VisitorRegistration'
import Login from './pages/Login'
import Register from './pages/Register'
import Schedule from './pages/Schedule'
import Spirit from './pages/Spirit'
import Players from './pages/Players'
import PlayerProfile from './pages/PlayerProfile'
import Leaderboard from './pages/Leaderboard'
import RoleBasedRedirect from './components/RoleBasedRedirect'

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<RoleBasedRedirect />} />
            
            {/* Player Dashboard - for all users */}
            <Route path="dashboard" element={<PlayerDashboard />} />
            
            {/* Admin Tournament Management */}
            <Route path="tournaments" element={<Dashboard />} />
            <Route path="tournaments/create" element={<TournamentForm />} />
            <Route path="tournaments/edit/:id" element={<TournamentForm />} />
            <Route path="tournaments/:id" element={<TournamentDetails />} />
            <Route path="tournaments/:tournamentId/register" element={<TeamRegistration />} />
            <Route path="tournaments/:tournamentId/join" element={<JoinTeam />} />
            
            {/* Shared routes */}
            <Route path="schedule" element={<Schedule />} />
            <Route path="spirit" element={<Spirit />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="players" element={<Players />} />
            <Route path="players/:id" element={<PlayerProfile />} />
            <Route path="visitors" element={<VisitorRegistration />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
