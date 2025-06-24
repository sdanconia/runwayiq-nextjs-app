import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Authentication middleware with Supabase integration
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip static files and assets immediately
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/health') ||
      pathname.includes('.') && !pathname.endsWith('.html')) {
    return NextResponse.next()
  }
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
    '/auth/auth-code-error',
    '/book-demo',
    '/about',
    '/services',
    '/case-studies',
    '/podcast',
    '/investors',
    '/terms',
    '/privacy'
  ]
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/sales-dashboard',
    '/profile',
    '/analytics',
    '/settings'
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    let response = NextResponse.next()

    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    // Log for debugging
    console.log(`[Middleware] Checking ${pathname}, session:`, !!session)
    
    if (!session) {
      console.log(`[Middleware] No session found, redirecting to login`)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // Response object for adding headers
  const response = NextResponse.next()

  // API routes protection
  if (pathname.startsWith('/api/notion') || pathname.startsWith('/api/campaigns')) {
    // Check authentication for API routes
    const accessToken = request.cookies.get('sb-access-token')
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Add security headers for API routes
    response.headers.set('X-RateLimit-Limit', '60')
    response.headers.set('X-RateLimit-Remaining', '59')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}