import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TournamentForm from './pages/TournamentForm'
import VisitorRegistration from './pages/VisitorRegistration'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/tournaments" replace />} />
          <Route path="/tournaments" element={<Dashboard />} />
          <Route path="/tournaments/create" element={<TournamentForm />} />
          <Route path="/tournaments/edit/:id" element={<TournamentForm />} />
          <Route path="/visitors" element={<VisitorRegistration />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
