import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

// Simple in-memory rate limiting (for demonstration - in production use Redis)
const rateLimit = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60

function checkRateLimit(ip: string) {
  const now = Date.now()
  const limit = rateLimit.get(ip)

  if (!limit || now - limit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, lastReset: now })
    return true
  }

  if (limit.count >= MAX_REQUESTS) {
    return false
  }

  limit.count++
  return true
}

export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  // 1. Rate Limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // 2. Authentication for protected routes
  const path = request.nextUrl.pathname
  if (path.startsWith('/api/purchase') || path.startsWith('/api/kyc')) {
    const token = request.cookies.get('auth-token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      await jwtVerify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
