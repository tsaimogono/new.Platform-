// app/api/super-admin/activity/route.js
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

    // For now, return empty array - you can implement activity logging later
    const activities = []

    return new Response(JSON.stringify(activities), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching activity:', error)
    return new Response(JSON.stringify({ message: 'Error fetching activity log' }), {
      status: 500,
    })
  }
}