// app/api/super-admin/agencies/route.js
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

    const agencies = await usersCollection.find({ 
      role: 'agency'
    }).sort({ createdAt: -1 }).toArray()

    // Get agent count for each agency
    const agenciesWithCounts = await Promise.all(
      agencies.map(async (agency) => {
        const agentCount = await usersCollection.countDocuments({ 
          agency: agency._id,
          role: 'agent'
        })
        return { ...agency, agentCount }
      })
    )

    return new Response(JSON.stringify(agenciesWithCounts), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching agencies:', error)
    return new Response(JSON.stringify({ message: 'Error fetching agencies' }), {
      status: 500,
    })
  }
}