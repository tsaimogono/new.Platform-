// app/api/super-admin/stats/route.js
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

    const [totalAgents, totalProperties, totalAgencies, activeTasks] = await Promise.all([
      db.collection('users').countDocuments({ role: 'agent' }),
      db.collection('properties').countDocuments(),
      db.collection('users').countDocuments({ role: 'agency' }),
      db.collection('tasks').countDocuments({ status: 'pending' })
    ])

    return new Response(JSON.stringify({
      totalAgents,
      totalProperties,
      totalAgencies,
      activeTasks
    }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return new Response(JSON.stringify({ message: 'Error fetching statistics' }), {
      status: 500,
    })
  }
}