// app/api/users/route.js
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Name, email, and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create profile based on role
   
if (role === 'agent') {
  await db.collection('profiles').insertOne({
    userId: result.insertedId,
    agencyName: '',
    agencyDescription: '',
    phone: '',
    address: '',
    profilePicture: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
} else {
  await db.collection('profiles').insertOne({
    userId: result.insertedId,
    phone: '',
    profilePicture: '',
    preferences: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (email) {
      const user = await db.collection('users').findOne({ email })
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user
      return new Response(JSON.stringify(userWithoutPassword), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // For admin to get all users
    const users = await db.collection('users').find({}).toArray()
    const usersWithoutPassword = users.map(({ password, ...user }) => user)
    
    return new Response(JSON.stringify(usersWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}