import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Routes qui doivent toujours être accessibles (même en maintenance)
  const excludedPaths = [
    '/api',
    '/_next',
    '/config',
    '/admin',
    '/maintenance',
    '/static',
    '/images',
    '/favicon.ico'
  ]
  
  // Vérifier si la route est exclue
  const isExcluded = excludedPaths.some(path => pathname.startsWith(path))
  
  if (isExcluded) {
    return NextResponse.next()
  }

  try {
    // Vérifier le cookie de maintenance d'abord (plus rapide)
    const maintenanceCookie = request.cookies.get('maintenanceMode')
    
    if (maintenanceCookie?.value === 'true') {
      console.log(`[Middleware] Maintenance active, redirecting ${pathname} to /maintenance`)
      // Rediriger vers la page de maintenance
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }

    // Si pas de cookie, vérifier via l'API
    const response = await fetch(`${request.nextUrl.origin}/api/settings`)
    
    if (response.ok) {
      const data = await response.json()
      
      // Créer la réponse
      const res = NextResponse.next()
      
      // Mettre à jour le cookie
      res.cookies.set('maintenanceMode', data.maintenanceMode ? 'true' : 'false', {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 // 1 minute
      })
      
      if (data.maintenanceMode) {
        console.log(`[Middleware] API says maintenance active, redirecting ${pathname} to /maintenance`)
        // Rediriger vers la page de maintenance
        return NextResponse.rewrite(new URL('/maintenance', request.url))
      }
      
      return res
    }
  } catch (error) {
    console.error('Middleware error:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}