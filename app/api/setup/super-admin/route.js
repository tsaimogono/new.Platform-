// app/api/setup/super-admin/route.js
import clientPromise from '../../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'Name, email, and password are required' }),
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if super admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'super_admin' })
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ 
          message: 'Super Admin already exists. You can login with the existing credentials.',
          existing: true 
        }),
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User with this email already exists' }),
        { status: 400 }
      )
    }

    // Hash password and create super admin
    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    })

    console.log('Super Admin created with ID:', result.insertedId)

    return new Response(
      JSON.stringify({ 
        message: 'Super Admin created successfully!',
        credentials: { email, password } 
      }),
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating super admin:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error: ' + error.message }),
      { status: 500 }
    )
  }
}