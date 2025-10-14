// app/api/create-super-admin/route.js
import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export async function GET(request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if super admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'super_admin' })
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ 
          message: 'Super Admin already exists',
          email: existingAdmin.email 
        }),
        { status: 200 }
      )
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await usersCollection.insertOne({
      name: 'Super Admin',
      email: 'superadmin@estate.com',
      password: hashedPassword,
      role: 'super_admin',
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    })

    return new Response(
      JSON.stringify({ 
        message: 'Super Admin created successfully',
        credentials: {
          email: 'superadmin@estate.com',
          password: 'admin123'
        }
      }),
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating super admin:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    )
  }
}