// app/api/super-admin/analytics/route.js
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
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7days'
    
    const client = await clientPromise
    const db = client.db()

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (range === '7days') startDate.setDate(now.getDate() - 7)
    else if (range === '30days') startDate.setDate(now.getDate() - 30)
    else if (range === '90days') startDate.setDate(now.getDate() - 90)

    // Get basic counts
    const [
      totalProperties,
      totalAgents,
      totalAgencies,
      completedTasks,
      propertyTypes,
      activeAgents,
      activeAgencies
    ] = await Promise.all([
      db.collection('properties').countDocuments(),
      db.collection('users').countDocuments({ role: 'agent' }),
      db.collection('users').countDocuments({ role: 'agency' }),
      db.collection('tasks').countDocuments({ status: 'completed' }),
      db.collection('properties').aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('users').countDocuments({ role: 'agent', isActive: true }),
      db.collection('users').countDocuments({ role: 'agency', isActive: true })
    ])

    const analytics = {
      totalProperties,
      totalAgents,
      totalAgencies,
      completedTasks,
      propertyTypes,
      activeAgents,
      activeAgencies,
      revenue: totalProperties * 1000, // Mock revenue calculation
      recentActivity: [] // You can populate this with actual activity data
    }

    return new Response(JSON.stringify(analytics), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return new Response(JSON.stringify({ message: 'Error fetching analytics' }), {
      status: 500,
    })
  }
}