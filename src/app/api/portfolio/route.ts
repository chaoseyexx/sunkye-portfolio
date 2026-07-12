import { NextRequest, NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile, generateId } from '@/lib/data'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface PortfolioItem {
    id: string
    title: string
    desc: string
    image: string
}

interface PortfolioData {
    environments: PortfolioItem[]
    structures: PortfolioItem[]
    interiors: PortfolioItem[]
    models: PortfolioItem[]
}

export async function GET() {
    try {
        const data = await readJsonFile<PortfolioData>('portfolio.json')
        return NextResponse.json(data)
    } catch (error) {
        console.error('[API] Portfolio GET Error:', error)
        return NextResponse.json({ error: 'Failed to read portfolio data' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { category, item } = await request.json()
        const data = await readJsonFile<PortfolioData>('portfolio.json')

        const prefix = category.slice(0, 3)
        const newItem = {
            ...item,
            id: generateId(prefix),
        }

        if (data && category in data) {
            (data as any)[category].push(newItem)
            await writeJsonFile('portfolio.json', data)
            return NextResponse.json({ success: true, item: newItem })
        }

        return NextResponse.json({ error: 'Invalid category or data not initialized' }, { status: 400 })
    } catch (error) {
        console.error('[API] Portfolio POST Error:', error)
        return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { category, item, items, reorder } = body
        const data = await readJsonFile<PortfolioData>('portfolio.json')

        // Handle reordering - replace entire category array
        if (reorder && items && data && category in data) {
            (data as any)[category] = items
            await writeJsonFile('portfolio.json', data)
            return NextResponse.json({ success: true })
        }

        // Handle single item update
        if (data && category in data && item) {
            const categoryItems = (data as any)[category] as PortfolioItem[]
            const index = categoryItems.findIndex(i => i.id === item.id)

            if (index !== -1) {
                categoryItems[index] = item
                await writeJsonFile('portfolio.json', data)
                return NextResponse.json({ success: true, item })
            }
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    } catch (error) {
        console.error('[API] Portfolio PUT Error:', error)
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const id = searchParams.get('id')

        if (!category || !id) {
            return NextResponse.json({ error: 'Missing category or id' }, { status: 400 })
        }

        const data = await readJsonFile<PortfolioData>('portfolio.json')

        if (data && category in data) {
            const items = (data as any)[category] as PortfolioItem[]
            const index = items.findIndex(i => i.id === id)

            if (index !== -1) {
                items.splice(index, 1)
                await writeJsonFile('portfolio.json', data)
                return NextResponse.json({ success: true })
            }
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    } catch (error) {
        console.error('[API] Portfolio DELETE Error:', error)
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}
