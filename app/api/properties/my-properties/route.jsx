// app/api/properties/my-properties/route.js
import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
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
    
    const properties = await db.collection('properties')
      .find({ agentId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()
    
    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return new Response(JSON.stringify([]), { // Return empty array on error
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}