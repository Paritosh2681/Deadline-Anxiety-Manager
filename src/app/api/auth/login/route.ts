import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { UserModel } from '@/lib/db/models/User'
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const token = await signToken(user._id.toString())
        const response = NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })
        setAuthCookie(response, token)
        return response
    } catch (error) {
        console.error('POST /api/auth/login error:', error)
        return NextResponse.json(
            { error: 'Failed to log in' },
            { status: 500 }
        )
    }
}
