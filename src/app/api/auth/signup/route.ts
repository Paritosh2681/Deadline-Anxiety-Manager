import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { UserModel } from '@/lib/db/models/User'
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            )
        }

        const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() })
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            )
        }

        const hashedPassword = await hashPassword(password)

        const user = await UserModel.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        })

        const token = await signToken(user._id.toString())
        setAuthCookie(token)

        return NextResponse.json(
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('POST /api/auth/signup error:', error)

        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        )
    }
}
