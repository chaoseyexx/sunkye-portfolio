import { getCollection } from './bmg-mongodb'

// Read from MongoDB
export async function readJsonFile<T>(filename: string): Promise<T> {
    const collectionName = filename.replace('.json', '')

    try {
        const collection = await getCollection(collectionName)

        // For array collections (reviews, skills)
        if (collectionName === 'reviews' || collectionName === 'skills') {
            const docs = await collection.find({}).toArray()
            return docs as T
        }

        // For object collections (portfolio, settings)
        const doc = await collection.findOne({ _type: collectionName })
        if (doc) {
            const { _id, _type, ...data } = doc as any
            return data as T
        }

        return {} as T
    } catch (error) {
        console.error(`[MongoDB] Read error for ${collectionName}:`, error)
        return {} as T
    }
}

// Write to MongoDB
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
    const collectionName = filename.replace('.json', '')

    try {
        const collection = await getCollection(collectionName)

        // For array collections (reviews, skills)
        if (collectionName === 'reviews' || collectionName === 'skills') {
            // Replace entire collection
            await collection.deleteMany({})
            const items = data as any[]
            if (items.length > 0) {
                await collection.insertMany(items)
            }
            return
        }

        // For object collections (portfolio, settings)
        await collection.updateOne(
            { _type: collectionName },
            { $set: { _type: collectionName, ...data as object } },
            { upsert: true }
        )
    } catch (error) {
        console.error(`[MongoDB] Write error for ${collectionName}:`, error)
        throw error
    }
}

export function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
