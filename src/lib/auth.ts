import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bmg123@portfolio'
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_VALUE = process.env.SESSION_SECRET || 'authenticated_bmg_admin_2024'

export async function verifyAuth(): Promise<boolean> {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE_NAME)
    return session?.value === SESSION_VALUE
}

export function validatePassword(password: string): boolean {
    return password === ADMIN_PASSWORD
}

export function getSessionCookie() {
    return {
        name: SESSION_COOKIE_NAME,
        value: SESSION_VALUE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    }
}

export function getClearSessionCookie() {
    return {
        name: SESSION_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 0,
        path: '/',
    }
}
