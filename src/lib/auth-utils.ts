import { cookies } from 'next/headers'
import { prisma } from './db'

export interface UserSession {
  id: string
  email: string
  businessId: string | null
  isSuperAdmin: boolean
  role: string
}

/**
 * Get authenticated user from cookie
 * Returns null if not authenticated
 */
export async function getUserFromCookie(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('auth-token')

    if (!authCookie) {
      return null
    }

    const sessionData = JSON.parse(authCookie.value)

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        email: true,
        businessId: true,
        isSuperAdmin: true,
        role: true
      }
    })

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting user from cookie:', error)
    return null
  }
}

/**
 * Require authenticated user (throws if not authenticated)
 */
export async function requireAuth(): Promise<UserSession> {
  const user = await getUserFromCookie()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Require SuperAdmin access (throws if not SuperAdmin)
 */
export async function requireSuperAdmin(): Promise<UserSession> {
  const user = await requireAuth()

  if (!user.isSuperAdmin) {
    throw new Error('SuperAdmin access required')
  }

  return user
}

/**
 * Require business context (throws if no businessId)
 */
export async function requireBusiness(): Promise<UserSession> {
  const user = await requireAuth()

  if (!user.businessId && !user.isSuperAdmin) {
    throw new Error('Business context required')
  }

  return user
}
