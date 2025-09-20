// app/api/favorites/route.js
import clientPromise from '../../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const favorites = await db.collection('favorites')
      .find({ userId: session.user.id })
      .toArray()
    
    return new Response(JSON.stringify(favorites), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const client = await clientPromise
    const db = client.db()
    const { propertyId } = await request.json()
    
    // Check if the favorite already exists
    const existingFavorite = await db.collection('favorites').findOne({
      userId: session.user.id,
      propertyId: propertyId
    })
    
    if (existingFavorite) {
      // Remove from favorites
      await db.collection('favorites').deleteOne({
        userId: session.user.id,
        propertyId: propertyId
      })
      
      return new Response(JSON.stringify({ message: 'Removed from favorites' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Add to favorites
      await db.collection('favorites').insertOne({
        userId: session.user.id,
        propertyId: propertyId,
        createdAt: new Date()
      })
      
      return new Response(JSON.stringify({ message: 'Added to favorites' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}