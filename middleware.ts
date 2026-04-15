import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
)

const PROTECTED_PATHS = ['/admin']
const PROTECTED_API_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']
const PROTECTED_API_PATHS = [
  '/api/projects',
  '/api/services',
  '/api/studio',
  '/api/upload',
]

function isProtected(req: NextRequest): boolean {
  const { pathname } = req.nextUrl

  // Allow login page
  if (pathname === '/admin/login') return false

  // Admin pages
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) return true

  // API mutations
  if (
    PROTECTED_API_METHODS.includes(req.method) &&
    PROTECTED_API_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return true
  }

  return false
}

export async function middleware(req: NextRequest) {
  if (!isProtected(req)) return NextResponse.next()

  const token = req.cookies.get('pshkrv_token')?.value
  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/projects/:path*', '/api/services', '/api/studio', '/api/upload'],
}
