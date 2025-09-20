// app/api/test/route.js
import clientPromise from '../../../lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray()
    
    return new Response(JSON.stringify({ 
      message: 'MongoDB connected successfully',
      collections: collections.map(c => c.name)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return new Response(JSON.stringify({ 
      message: 'MongoDB connection failed',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}