// app/api/super-admin/agents/route.js
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import clientPromise from '../../../../lib/mongodb'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'super_admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const agents = await usersCollection.find({ 
      role: 'agent'
    }).sort({ createdAt: -1 }).toArray()

    return new Response(JSON.stringify(agents), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return new Response(JSON.stringify({ message: 'Error fetching agents' }), {
      status: 500,
    })
  }
}