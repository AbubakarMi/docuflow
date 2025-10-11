import { useState, useEffect } from 'react'

interface SessionData {
  userId: string
  businessId?: string
  businessName?: string
  isSuperAdmin: boolean
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setSession(data)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { session, loading }
}
