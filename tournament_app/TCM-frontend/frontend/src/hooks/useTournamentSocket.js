import { useEffect, useRef, useState } from 'react'
import { WS_BASE } from '../api'

export const useTournamentSocket = (tournamentId, onMessage, pollInterval = 10000) => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const pollingRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    if (!tournamentId) return

    let isMounted = true

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


    const startPolling = () => {
      if (pollingRef.current) return

      console.log('Starting fallback polling every', pollInterval, 'ms')
      pollingRef.current = setInterval(() => {
  
        if (isMounted && onMessage) {
     
          onMessage({
            type: 'poll.update',
            payload: { timestamp: new Date().toISOString() }
          })
        }
      }, pollInterval)
    }

    connectWebSocket()

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
