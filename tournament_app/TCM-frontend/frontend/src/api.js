// API integration layer for Django backend
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'
export const WS_BASE = import.meta.env.VITE_WS_BASE || 'ws://127.0.0.1:8000'

// Helper to construct headers
const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Error handling wrapper
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }
  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true }
  }
  return response.json()
}

/**
 * Fetch all tournaments
 * Django returns: { count, next, previous, results: [...] } (paginated)
 */
export const fetchTournaments = async (token = null, status = null, search = null) => {
  try {
    let url = `${API_BASE}/tournaments/`
    const params = new URLSearchParams()
    
    if (status && status !== 'all') {
      params.append('status', status.toUpperCase())
    }
    if (search) {
      params.append('search', search)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    // Return results array if paginated, otherwise return data
    return data.results || data
  } catch (error) {
    console.error('Error fetching tournaments:', error.message)
    throw error
  }
}

/**
 * Fetch a single tournament by ID
 * Django returns: Tournament object with nested teams, fields, matches
 */
export const fetchTournament = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error fetching tournament:', error.message)
    throw error
  }
}

/**
 * Create a new tournament
 * Django expects: { name, location, city, state, country, start_date, end_date, status, description, rules }
 * Django returns: Created tournament object
 */
export const createTournament = async (tournamentData, token = null) => {
  try {
    // Map frontend fields to Django fields
    const djangoData = {
      name: tournamentData.title || tournamentData.name,
      location: tournamentData.location || tournamentData.venue || '',
      city: tournamentData.city || '',
      state: tournamentData.state || '',
      country: tournamentData.country || '',
      start_date: tournamentData.start_date || tournamentData.startDate,
      end_date: tournamentData.end_date || tournamentData.endDate,
      status: (tournamentData.status || 'DRAFT').toUpperCase(),
      description: tournamentData.description || '',
      rules: tournamentData.rules || '',
    }
    
    const response = await fetch(`${API_BASE}/tournaments/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error creating tournament:', error.message)
    throw error
  }
}

/**
 * Update an existing tournament
 * Django expects: Partial tournament object
 */
export const updateTournament = async (id, tournamentData, token = null) => {
  try {
    // Map frontend fields to Django fields
    const djangoData = {}
    if (tournamentData.title || tournamentData.name) {
      djangoData.name = tournamentData.title || tournamentData.name
    }
    if (tournamentData.location || tournamentData.venue) {
      djangoData.location = tournamentData.location || tournamentData.venue
    }
    if (tournamentData.city) djangoData.city = tournamentData.city
    if (tournamentData.state) djangoData.state = tournamentData.state
    if (tournamentData.country) djangoData.country = tournamentData.country
    if (tournamentData.start_date || tournamentData.startDate) {
      djangoData.start_date = tournamentData.start_date || tournamentData.startDate
    }
    if (tournamentData.end_date || tournamentData.endDate) {
      djangoData.end_date = tournamentData.end_date || tournamentData.endDate
    }
    if (tournamentData.status) {
      djangoData.status = tournamentData.status.toUpperCase()
    }
    if (tournamentData.description !== undefined) {
      djangoData.description = tournamentData.description
    }
    if (tournamentData.rules !== undefined) {
      djangoData.rules = tournamentData.rules
    }
    
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error updating tournament:', error.message)
    throw error
  }
}

/**
 * Delete a tournament
 */
export const deleteTournament = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error deleting tournament:', error.message)
    throw error
  }
}

/**
 * Publish a tournament (change status to PUBLISHED)
 */
export const publishTournament = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${id}/publish/`, {
      method: 'POST',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error publishing tournament:', error.message)
    throw error
  }
}

/**
 * Create a snapshot of tournament state
 * Django expects: { notes: string }
 */
export const createSnapshot = async (tournamentId, description = '', token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/snapshot/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ notes: description }),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error creating snapshot:', error.message)
    throw error
  }
}

/**
 * Fetch snapshots for a tournament
 */
export const fetchSnapshots = async (tournamentId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/tournaments/${tournamentId}/snapshots/`, {
      method: 'GET',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error fetching snapshots:', error.message)
    throw error
  }
}

/**
 * Register a visitor
 * Django expects: { tournament, name, email, phone, visit_date }
 */
export const postVisitor = async (visitorData, token = null) => {
  try {
    const djangoData = {
      tournament: visitorData.tournament_id || visitorData.tournament,
      name: visitorData.name,
      email: visitorData.email,
      phone: visitorData.phone || '',
      visit_date: visitorData.visit_date || new Date().toISOString().split('T')[0],
      notes: visitorData.notes || visitorData.role || '',
    }
    
    const response = await fetch(`${API_BASE}/visitors/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error registering visitor:', error.message)
    throw error
  }
}

/**
 * Fetch all visitors (optionally filtered by tournament)
 */
export const fetchVisitors = async (tournamentId = null, token = null) => {
  try {
    let url = `${API_BASE}/visitors/`
    if (tournamentId) {
      url += `?tournament=${tournamentId}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    return data.results || data
  } catch (error) {
    console.error('Error fetching visitors:', error.message)
    throw error
  }
}

/**
 * Update visitor (e.g., check-in)
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
    console.error('Error updating visitor:', error.message)
    throw error
  }
}

/**
 * Check-in a visitor
 */
export const checkInVisitor = async (id, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/visitors/${id}/check_in/`, {
      method: 'POST',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error checking in visitor:', error.message)
    throw error
  }
}

/**
 * Register a team for a tournament
 * Django expects: { tournament, name, short_name, captain_name, contact_email, contact_phone }
 */
export const registerTeam = async (tournamentId, teamData, token = null) => {
  try {
    const djangoData = {
      tournament: tournamentId,
      name: teamData.name,
      short_name: teamData.short_name || teamData.shortName || '',
      captain_name: teamData.captain || teamData.captain_name || '',
      contact_email: teamData.contact_email || teamData.email || '',
      contact_phone: teamData.contact_phone || teamData.phone || '',
    }
    
    const response = await fetch(`${API_BASE}/teams/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error registering team:', error.message)
    throw error
  }
}

/**
 * Fetch all teams for a tournament
 */
export const fetchTeams = async (tournamentId, token = null) => {
  try {
    let url = `${API_BASE}/teams/`
    if (tournamentId) {
      url += `?tournament=${tournamentId}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    return data.results || data
  } catch (error) {
    console.error('Error fetching teams:', error.message)
    throw error
  }
}

/**
 * Update team information
 */
export const updateTeam = async (tournamentId, teamId, teamData, token = null) => {
  try {
    const djangoData = {}
    if (teamData.name) djangoData.name = teamData.name
    if (teamData.short_name || teamData.shortName) {
      djangoData.short_name = teamData.short_name || teamData.shortName
    }
    if (teamData.captain || teamData.captain_name) {
      djangoData.captain_name = teamData.captain || teamData.captain_name
    }
    if (teamData.contact_email || teamData.email) {
      djangoData.contact_email = teamData.contact_email || teamData.email
    }
    if (teamData.contact_phone || teamData.phone) {
      djangoData.contact_phone = teamData.contact_phone || teamData.phone
    }
    
    const response = await fetch(`${API_BASE}/teams/${teamId}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error updating team:', error.message)
    throw error
  }
}

/**
 * Delete a team
 */
export const deleteTeam = async (tournamentId, teamId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/teams/${teamId}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error deleting team:', error.message)
    throw error
  }
}

/**
 * Fetch all fields for a tournament
 */
export const fetchFields = async (tournamentId, token = null) => {
  try {
    let url = `${API_BASE}/fields/`
    if (tournamentId) {
      url += `?tournament=${tournamentId}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    return data.results || data
  } catch (error) {
    console.error('Error fetching fields:', error.message)
    throw error
  }
}

/**
 * Create a field
 */
export const createField = async (tournamentId, fieldData, token = null) => {
  try {
    const djangoData = {
      tournament: tournamentId,
      name: fieldData.name,
      field_number: fieldData.field_number || fieldData.number,
      location_details: fieldData.location_details || fieldData.location || '',
      is_available: fieldData.is_available !== undefined ? fieldData.is_available : true,
    }
    
    const response = await fetch(`${API_BASE}/fields/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error creating field:', error.message)
    throw error
  }
}

/**
 * Update a field
 */
export const updateField = async (fieldId, fieldData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/fields/${fieldId}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(fieldData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error updating field:', error.message)
    throw error
  }
}

/**
 * Delete a field
 */
export const deleteField = async (fieldId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/fields/${fieldId}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error deleting field:', error.message)
    throw error
  }
}

/**
 * Fetch all matches for a tournament
 */
export const fetchMatches = async (tournamentId, token = null) => {
  try {
    let url = `${API_BASE}/matches/`
    if (tournamentId) {
      url += `?tournament=${tournamentId}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(token),
    })
    const data = await handleResponse(response)
    return data.results || data
  } catch (error) {
    console.error('Error fetching matches:', error.message)
    throw error
  }
}

/**
 * Create a match
 */
export const createMatch = async (tournamentId, matchData, token = null) => {
  try {
    const djangoData = {
      tournament: tournamentId,
      match_number: matchData.match_number || matchData.number,
      team_a: matchData.team_a || matchData.teamA,
      team_b: matchData.team_b || matchData.teamB,
      field: matchData.field || null,
      scheduled_datetime: matchData.scheduled_datetime || matchData.datetime,
      status: (matchData.status || 'SCHEDULED').toUpperCase(),
    }
    
    const response = await fetch(`${API_BASE}/matches/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(djangoData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error creating match:', error.message)
    throw error
  }
}

/**
 * Update match score
 */
export const updateMatchScore = async (matchId, scoreData, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/matches/${matchId}/update_score/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(scoreData),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Error updating match score:', error.message)
    throw error
  }
}