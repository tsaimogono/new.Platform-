// app/api/super-admin/tasks/route.js
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
    const tasksCollection = db.collection('tasks')

    const tasks = await tasksCollection.find({})
      .sort({ createdAt: -1 })
      .toArray()

    return new Response(JSON.stringify(tasks), {
      status: 200,
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new Response(JSON.stringify({ message: 'Error fetching tasks' }), {
      status: 500,
    })
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'super_admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const taskData = await request.json()
    const client = await clientPromise
    const db = client.db()
    const tasksCollection = db.collection('tasks')

    const task = {
      ...taskData,
      status: 'pending',
      createdAt: new Date(),
      createdBy: session.user.id
    }

    const result = await tasksCollection.insertOne(task)

    return new Response(JSON.stringify({ 
      message: 'Task created successfully',
      taskId: result.insertedId 
    }), {
      status: 201,
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return new Response(JSON.stringify({ message: 'Error creating task' }), {
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
    const { taskId, status } = await request.json()
    const client = await clientPromise
    const db = client.db()
    const tasksCollection = db.collection('tasks')

    await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { status, updatedAt: new Date() } }
    )

    return new Response(JSON.stringify({ message: 'Task updated successfully' }), {
      status: 200,
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return new Response(JSON.stringify({ message: 'Error updating task' }), {
      status: 500,
    })
  }
}