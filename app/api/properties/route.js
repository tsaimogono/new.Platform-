// app/api/properties/route.js
import clientPromise from '../../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    
    let query = {}
    
    if (city) query.city = { $regex: city, $options: 'i' }
    if (type) query.type = type
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }
    if (bedrooms) query.bedrooms = parseInt(bedrooms)
    
    const properties = await db.collection('properties')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()
    
    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'agent') {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const client = await clientPromise
    const db = client.db()
    const propertyData = await request.json()
    
    // Validate required fields
    if (!propertyData.title || !propertyData.description || !propertyData.price) {
      return new Response(JSON.stringify({ message: 'Title, description, and price are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const result = await db.collection('properties').insertOne({
      ...propertyData,
      agentId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    return new Response(JSON.stringify({ 
      message: 'Property created successfully',
      id: result.insertedId 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}