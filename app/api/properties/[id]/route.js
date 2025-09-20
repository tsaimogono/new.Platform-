// app/api/properties/[id]/route.js
import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Convert string ID to ObjectId
    let propertyId;
    try {
      propertyId = new ObjectId(params.id);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid property ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    const property = await db.collection('properties').findOne({ _id: propertyId })
    
    if (!property) {
      return new Response(JSON.stringify({ message: 'Property not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({
      _id: property._id.toString(),
      title: property.title || '',
      description: property.description || '',
      type: property.type || '',
      price: property.price || 0,
      location: property.location || '',
      city: property.city || '',
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
      amenities: property.amenities || [],
      images: property.images || [],
      agentId: property.agentId || '',
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching property:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}