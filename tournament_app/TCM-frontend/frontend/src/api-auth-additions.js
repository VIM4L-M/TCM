// Authentication API additions for api.js
// Add these to the end of your api.js file

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
      headers: getHeaders(token),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Get current user failed:', error)
    throw error
  }
}
