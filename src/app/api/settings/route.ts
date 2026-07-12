import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/data'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Settings {
    site: {
        title: string
        description: string
    }
    hero: {
        subtitle: string
        title: string
        description: string
        featuredImage: string
        featuredTitle: string
        featuredDescription: string
    }
    about: {
        name: string
        age: string
        experience: string
        profileImage: string
        bio: string[]
        whyHireMe: string[]
    }
    contact: {
        email: string
        robloxUsername: string
        discordUsername: string
        discordLink: string
        availability: string
    }
    collaborations: {
        id: string
        name: string
        image: string
    }[]
}

export async function GET() {
    try {
        const data = await readJsonFile<Settings>('settings.json')
        return NextResponse.json(data)
    } catch (error) {
        console.error('[API] Settings GET Error:', error)
        return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const settings = await request.json()
        await writeJsonFile('settings.json', settings)
        return NextResponse.json({ success: true, settings })
    } catch (error) {
        console.error('[API] Settings PUT Error:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}
