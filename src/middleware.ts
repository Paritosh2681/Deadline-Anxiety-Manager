import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'dam-token'

const PUBLIC_PATHS = ['/', '/login', '/signup']
const AUTH_API_PREFIX = '/api/auth'

function getJwtSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not defined')
    return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public pages and auth API routes
    if (
        PUBLIC_PATHS.includes(pathname) ||
        pathname.startsWith(AUTH_API_PREFIX)
    ) {
        return NextResponse.next()
    }

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Check for auth token
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        await jwtVerify(token, getJwtSecret())
        return NextResponse.next()
    } catch {
        // Invalid token — clear it and redirect
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
        return response
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
