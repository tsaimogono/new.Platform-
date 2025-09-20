// app/api/profiles/me/route.js
import clientPromise from '../../../../lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

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
    
    const profile = await db.collection('profiles').findOne({ userId: session.user.id })
    
    if (!profile) {
      // Return a default profile if none exists
      const defaultProfile = {
        userId: session.user.id,
        agencyName: 'Your Agency Name',
        agencyDescription: 'Describe your agency here',
        phone: '',
        address: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      // Insert the default profile
      await db.collection('profiles').insertOne(defaultProfile)
      
      return new Response(JSON.stringify(defaultProfile), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PUT(request) {
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
    const profileData = await request.json()
    
    // Update or create the profile
    const result = await db.collection('profiles').updateOne(
      { userId: session.user.id },
      { $set: { ...profileData, updatedAt: new Date() } },
      { upsert: true }
    )
    
    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}