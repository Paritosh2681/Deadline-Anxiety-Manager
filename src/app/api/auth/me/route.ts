import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { UserModel } from '@/lib/db/models/User'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const userId = await getAuthUser(request)
        if (!userId) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        await connectDB()
        const user = await UserModel.findById(userId).select('-password').lean() as any

        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('GET /api/auth/me error:', error)
        return NextResponse.json({ user: null }, { status: 401 })
    }
}
