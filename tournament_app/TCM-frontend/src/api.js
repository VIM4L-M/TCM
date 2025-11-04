// API integration layer with fetch stubs
// Falls back to seed data when backend is unavailable

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
export const WS_BASE = import.meta.env.VITE_WS_BASE || 'ws://localhost:8000'

// Helper to construct headers
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  // Get token from parameter or localStorage
  const authToken = token || localStorage.getItem('auth_token')
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`
  }
  return headers
}

// Error handling wrapper
const handleResponse = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type')
    let errorDetail = `HTTP ${response.status}`
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json()
        errorDetail = error.detail || error.message || JSON.stringify(error)
      } catch (e) {
        // Failed to parse JSON error
      }
    } else {
      const text = await response.text()
      errorDetail = text || errorDetail
    }
    
    throw new Error(errorDetail)
  }
  return response.json()
}

/**
 * Fetch all tournaments
 * Expected response: Array of tournament objects
 */
export const fetchTournaments = async (token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    
    // Handle paginated response from Django REST Framework
    const tournaments = data.results || data
    
    // Map backend field names to frontend field names
    return tournaments.map(tournament => ({
      ...tournament,
      title: tournament.name, // Frontend uses 'title' instead of 'name'
    }))
  } catch (error) {
    console.warn('Backend unavailable, using seed data:', error.message)
    // Return null to signal fallback is needed
    return null
  }
}

/**
 * Fetch a single tournament by ID
 * Expected response: Tournament object with full details
 */
export const fetchTournament = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    // Map backend field names to frontend field names
    return {
      ...data,
      title: data.name, // Frontend uses 'title' instead of 'name'
    }
  } catch (error) {
    console.warn('Backend unavailable, using seed data:', error.message)
    return null
  }
}

/**
 * Create a new tournament
 * Expected request body: { title, slug, description, rules, start_date, end_date, ... }
 * Expected response: Created tournament object with ID
 */
export const createTournament = async (tournamentData, token = null) => {
  try {
    // Map frontend field names to backend field names
    const backendData = {
      ...tournamentData,
      name: tournamentData.title, // Backend uses 'name' instead of 'title'
    }
    delete backendData.title // Remove the frontend field name
    
    console.log('Creating tournament with data:', backendData)
    
    const response = await fetch(`${API_BASE}/tournaments/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(backendData),
    })
    
    const result = await handleResponse(response)
    console.log('Tournament created successfully:', result)
    return result
  } catch (error) {
    console.error('Failed to create tournament:', error.message)
    console.error('Full error:', error)
    throw error // Re-throw so TournamentForm can catch it
  }
}

/**
 * Update an existing tournament
 * Expected request body: Partial tournament object with fields to update
 * Expected response: Updated tournament object
 */
export const updateTournament = async (id, tournamentData, token = null) => {
  try {
    // Map frontend field names to backend field names
    const backendData = { ...tournamentData }
    
    // Only map title to name if title exists
    if (backendData.title) {
      backendData.name = backendData.title
      delete backendData.title
    }
    
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(backendData),
    })
    const data = await handleResponse(response)
    // Map backend field names to frontend field names
    return {
      ...data,
      title: data.name,
    }
  } catch (error) {
    console.warn('Backend unavailable, simulating update:', error.message)
    throw error // Re-throw the error so the caller can handle it
  }
}

/**
 * Delete a tournament
 * Expected response: 204 No Content or success message
 */
export const deleteTournament = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })
    if (response.status === 204) {
      return { success: true }
    }
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating delete:', error.message)
    return { success: true }
  }
}

/**
 * Create a snapshot of tournament state
 * Expected request body: { description?: string }
 * Expected response: { id, tournament_id, created_at, created_by, data: {...} }
 */
export const createSnapshot = async (tournamentId, description = '', token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/snapshot/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ description }),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating snapshot:', error.message)
    return {
      id: 'snap-' + Date.now(),
      tournament_id: tournamentId,
      created_at: new Date().toISOString(),
      created_by: 'demo-user',
      description: description || 'Demo snapshot',
    }
  }
}

/**
 * Fetch snapshots for a tournament
 * Expected response: Array of snapshot objects
 */
export const fetchSnapshots = async (tournamentId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/snapshots/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, using seed snapshots:', error.message)
    return null
  }
}

/**
 * Register a visitor
 * Expected request body: { name, email, phone, role }
 * Expected response: Created visitor object with ID
 */
export const postVisitor = async (visitorData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/visitors/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(visitorData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating visitor registration:', error.message)
    return {
      ...visitorData,
      id: 'vis-' + Date.now(),
      registered_at: new Date().toISOString(),
      checked_in: false,
    }
  }
}

/**
 * Fetch all visitors
 * Expected response: Array of visitor objects
 */
export const fetchVisitors = async (token = null) => {
  try {
    const response = await fetch(`${API_BASE}/visitors/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, using seed visitors:', error.message)
    return null
  }
}

/**
 * Update visitor check-in status
 * Expected request body: { checked_in: boolean }
 * Expected response: Updated visitor object
 */
export const updateVisitor = async (id, updates, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/visitors/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(updates),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating visitor update:', error.message)
    return { id, ...updates }
  }
}

/**
 * Register a team for a tournament
 * This endpoint is called from student portal when students register a team
 * Expected request body: { tournament_id, name, captain, contact_email, contact_phone, members?: [] }
 * Expected response: Created team object with ID
 */
export const registerTeam = async (tournamentId, teamData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/teams/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(teamData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating team registration:', error.message)
    return {
      ...teamData,
      id: 'team-' + Date.now(),
      tournament_id: tournamentId,
      registered_at: new Date().toISOString(),
    }
  }
}

/**
 * Fetch all teams for a tournament
 * Expected response: Array of team objects
 */
export const fetchTeams = async (tournamentId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/teams/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, using local teams data:', error.message)
    return null
  }
}

/**
 * Fetch all players (demo fallback)
 */
export const fetchPlayers = async (token = null) => {
  try {
    const response = await fetch(`${API_BASE}/players/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, using seed players:', error.message)
    return null
  }
}

export const fetchPlayer = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/players/${id}/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, using seed player:', error.message)
    return null
  }
}

export const createPlayer = async (playerData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/players/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(playerData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating player create:', error.message)
    return {
      ...playerData,
      id: 'pl-' + Date.now(),
      created_at: new Date().toISOString(),
    }
  }
}

export const updatePlayer = async (id, updates, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/players/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(updates),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating player update:', error.message)
    return { id, ...updates }
  }
}

/**
 * Update team information
 * Expected request body: Partial team object
 * Expected response: Updated team object
 */
export const updateTeam = async (tournamentId, teamId, teamData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/teams/${teamId}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(teamData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating team update:', error.message)
    return { id: teamId, ...teamData }
  }
}

/**
 * Delete/withdraw a team from tournament
 * Expected response: 204 No Content or success message
 */
export const deleteTeam = async (tournamentId, teamId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/teams/${teamId}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })
    if (response.status === 204) {
      return { success: true }
    }
    return await handleResponse(response)
  } catch (error) {
    console.warn('Backend unavailable, simulating team deletion:', error.message)
    return { success: true }
  }
}

// ==================== AUTHENTICATION ====================

/**
 * Login user
 * Expected request: { username, password } or { email, password }
 * Expected response: { token, user }
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

/**
 * Register new user
 * Expected request: { username, email, password, password2, role }
 * Expected response: { token, user }
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

/**
 * Get current logged-in user
 * Expected response: User object with profile
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('No token found')
    }
    const response = await fetch(`${API_BASE}/auth/me/`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get current user failed:', error)
    throw error
  }
}
