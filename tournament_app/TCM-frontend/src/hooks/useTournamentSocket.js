import { useEffect, useRef, useState } from 'react'
import { WS_BASE } from '../api'

/**
 * Real-time WebSocket hook for tournament updates
 * 
 * Connects to: ${WS_BASE}/ws/tournaments/${id}/
 * 
 * Expected message structure:
 * {
 *   type: 'tournament.updated' | 'match.scheduled' | 'team.registered' | 'field.updated',
 *   payload: { ... relevant data ... }
 * }
 * 
 * Falls back to polling if WebSocket unavailable
 */
export const useTournamentSocket = (tournamentId, onMessage, pollInterval = 10000) => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const pollingRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    if (!tournamentId) return

    let isMounted = true

    // Attempt WebSocket connection
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`${WS_BASE}/ws/tournaments/${tournamentId}/`)
        
        ws.onopen = () => {
          if (isMounted) {
            console.log('WebSocket connected for tournament:', tournamentId)
            setIsConnected(true)
            setError(null)
            // Stop polling if it was running
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
          }
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            if (isMounted && onMessage) {
              onMessage(message)
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err)
          }
        }

        ws.onerror = (err) => {
          console.warn('WebSocket error:', err)
          if (isMounted) {
            setError('WebSocket connection failed')
          }
        }

        ws.onclose = () => {
          if (isMounted) {
            console.log('WebSocket disconnected')
            setIsConnected(false)
            
            // Attempt to reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                console.log('Attempting to reconnect WebSocket...')
                connectWebSocket()
              }
            }, 5000)
          }
        }

        wsRef.current = ws
      } catch (err) {
        console.warn('WebSocket not available, falling back to polling')
        setError('WebSocket unavailable')
        startPolling()
      }
    }

    // Fallback polling mechanism
    const startPolling = () => {
      if (pollingRef.current) return

      console.log('Starting fallback polling every', pollInterval, 'ms')
      pollingRef.current = setInterval(() => {
        // TODO: Implement actual polling fetch call to get tournament updates
        // This would call fetchTournament() and compare with cached state
        if (isMounted && onMessage) {
          // Simulate polling update message
          onMessage({
            type: 'poll.update',
            payload: { timestamp: new Date().toISOString() }
          })
        }
      }, pollInterval)
    }

    // Try WebSocket first
    connectWebSocket()

    // Cleanup
    return () => {
      isMounted = false
      
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [tournamentId, onMessage, pollInterval])

  // Method to send messages through WebSocket
  const send = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    }
    console.warn('Cannot send message: WebSocket not connected')
    return false
  }

  return {
    isConnected,
    error,
    send
  }
}
