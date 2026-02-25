import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'dam-token'
const SALT_ROUNDS = 12

function getJwtSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not defined in environment variables')
    return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export async function signToken(userId: string): Promise<string> {
    return new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
        const { payload } = await jwtVerify(token, getJwtSecret())
        return { userId: payload.userId as string }
    } catch {
        return null
    }
}

export async function getAuthUser(request: NextRequest): Promise<string | null> {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    const payload = await verifyToken(token)
    return payload?.userId ?? null
}

export function setAuthCookie(response: NextResponse, token: string) {
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

export function clearAuthCookie(response: NextResponse) {
    response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    })
}

export { COOKIE_NAME }
