import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile, generateId } from '@/lib/data'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Skill {
    id: string
    title: string
    desc: string
    icon: string
    skills: string[]
}

export async function GET() {
    try {
        const data = await readJsonFile<Skill[]>('skills.json')
        return NextResponse.json(data)
    } catch (error) {
        console.error('[API] Skills GET Error:', error)
        return NextResponse.json({ error: 'Failed to read skills' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const skill = await request.json()
        const data = await readJsonFile<Skill[]>('skills.json')

        const skills = Array.isArray(data) ? data : []

        const newSkill = {
            ...skill,
            id: generateId('skill'),
        }

        skills.push(newSkill)
        await writeJsonFile('skills.json', skills)
        return NextResponse.json({ success: true, skill: newSkill })
    } catch (error) {
        console.error('[API] Skills POST Error:', error)
        return NextResponse.json({ error: 'Failed to add skill' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Handle reordering - replace entire array
        if (body.reorder && body.items) {
            await writeJsonFile('skills.json', body.items)
            return NextResponse.json({ success: true })
        }

        // Handle single item update
        const skill = body
        const data = await readJsonFile<Skill[]>('skills.json')

        const skills = Array.isArray(data) ? data : []
        const index = skills.findIndex(s => s.id === skill.id)

        if (index !== -1) {
            skills[index] = skill
            await writeJsonFile('skills.json', skills)
            return NextResponse.json({ success: true, skill })
        }

        return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    } catch (error) {
        console.error('[API] Skills PUT Error:', error)
        return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        }

        const data = await readJsonFile<Skill[]>('skills.json')
        const skills = Array.isArray(data) ? data : []
        const index = skills.findIndex(s => s.id === id)

        if (index !== -1) {
            skills.splice(index, 1)
            await writeJsonFile('skills.json', skills)
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    } catch (error) {
        console.error('[API] Skills DELETE Error:', error)
        return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
    }
}
