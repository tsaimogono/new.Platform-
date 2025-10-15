// app/api/super-admin/properties/route.js
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
    const propertiesCollection = db.collection('properties')

    const properties = await propertiesCollection.find({})
      .sort({ createdAt: -1 })
      .toArray()

    return new Response(JSON.stringify(properties), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return new Response(JSON.stringify({ message: 'Error fetching properties' }), {
      status: 500,
    })
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'super_admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const { propertyId, isActive } = await request.json()
    const client = await clientPromise
    const db = client.db()
    const propertiesCollection = db.collection('properties')

    await propertiesCollection.updateOne(
      { _id: new ObjectId(propertyId) },
      { $set: { isActive } }
    )

    return new Response(JSON.stringify({ message: 'Property updated successfully' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return new Response(JSON.stringify({ message: 'Error updating property' }), {
      status: 500,
    })
  }
}