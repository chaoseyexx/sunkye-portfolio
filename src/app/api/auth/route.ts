import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validatePassword, getSessionCookie, getClearSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json()

        if (validatePassword(password)) {
            const cookieStore = await cookies()
            const sessionCookie = getSessionCookie()
            cookieStore.set(sessionCookie)

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies()
        const clearCookie = getClearSessionCookie()
        cookieStore.set(clearCookie)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
