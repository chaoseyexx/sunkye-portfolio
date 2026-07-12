import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
        console.error('MONGODB_URI not set in production environment')
    } else {
        console.warn('MONGODB_URI not set - database functionality will fail')
    }
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined')
    }

    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb }
    }

    // In development mode, use a global variable so we don't spam connections
    let client: MongoClient
    if (process.env.NODE_ENV === 'development') {
        if (!(global as any)._mongoClient) {
            (global as any)._mongoClient = new MongoClient(MONGODB_URI)
        }
        client = (global as any)._mongoClient
        await client.connect()
    } else {
        client = new MongoClient(MONGODB_URI)
        await client.connect()
    }

    const db = client.db()

    cachedClient = client
    cachedDb = db

    return { client, db }
}

export async function getCollection<T extends object>(name: string) {
    const { db } = await connectToDatabase()
    return db.collection<T>(name)
}
