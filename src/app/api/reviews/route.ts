import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile, generateId } from '@/lib/data'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface Review {
    id: string
    name: string
    role: string
    content: string
    avatarColor: string
    rating: number
    price: string
    project: string
}

export async function GET() {
    try {
        const data = await readJsonFile<Review[]>('reviews.json')
        return NextResponse.json(data)
    } catch (error) {
        console.error('[API] Reviews GET Error:', error)
        return NextResponse.json({ error: 'Failed to read reviews' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const review = await request.json()
        const data = await readJsonFile<Review[]>('reviews.json')

        // Safety check if data isn't an array
        const reviews = Array.isArray(data) ? data : []

        const newReview = {
            ...review,
            id: generateId('rev'),
        }

        reviews.push(newReview)
        await writeJsonFile('reviews.json', reviews)
        return NextResponse.json({ success: true, review: newReview })
    } catch (error) {
        console.error('[API] Reviews POST Error:', error)
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 })
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
            await writeJsonFile('reviews.json', body.items)
            return NextResponse.json({ success: true })
        }

        // Handle single item update
        const review = body
        const data = await readJsonFile<Review[]>('reviews.json')

        // Safety check
        const reviews = Array.isArray(data) ? data : []
        const index = reviews.findIndex(r => r.id === review.id)

        if (index !== -1) {
            reviews[index] = review
            await writeJsonFile('reviews.json', reviews)
            return NextResponse.json({ success: true, review })
        }

        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    } catch (error) {
        console.error('[API] Reviews PUT Error:', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
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

        const data = await readJsonFile<Review[]>('reviews.json')
        const reviews = Array.isArray(data) ? data : []

        const index = reviews.findIndex(r => r.id === id)

        if (index !== -1) {
            reviews.splice(index, 1)
            await writeJsonFile('reviews.json', reviews)
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    } catch (error) {
        console.error('[API] Reviews DELETE Error:', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}
