// app/api/super-admin/users/route.js
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import clientPromise from '../../../../lib/mongodb'

export async function PUT(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'super_admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const { userId, isActive } = await request.json()
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isActive } }
    )

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return new Response(JSON.stringify({ message: 'Error updating user' }), {
      status: 500,
    })
  }
}