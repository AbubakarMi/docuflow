import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/generate',
  '/templates',
  '/inventory',
  '/scan-and-sell',
  '/users',
  '/settings',
  '/superadmin',
  '/stock',
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/public')

  // If it's a public route or API route, allow access
  if (isPublicRoute || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // For protected routes, check if user has a session/token
  const token = request.cookies.get('token')?.value ||
                request.cookies.get('session')?.value ||
                request.cookies.get('auth-token')?.value

  if (isProtectedRoute && !token) {
    // Redirect to login if accessing protected route without authentication
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
