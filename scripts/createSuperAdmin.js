// scripts/createSuperAdmin.js
import clientPromise from '../lib/mongodb'
import bcrypt from 'bcryptjs'

async function createSuperAdmin() {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if super admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'super_admin' })
    
    if (existingAdmin) {
      console.log('Super Admin already exists!')
      return
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
    
    console.log('Super Admin created successfully!')
    console.log('Email: superadmin@estate.com')
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error creating super admin:', error)
  }
}

createSuperAdmin()// scripts/createSuperAdmin.js
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

async function createSuperAdmin() {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('users')

    // Check if super admin already exists
    const existingAdmin = await usersCollection.findOne({ role: 'super_admin' })
    if (existingAdmin) {
      console.log('✅ Super Admin already exists:')
      console.log('Email:', existingAdmin.email)
      console.log('You can reset the password if needed')
      return
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const result = await usersCollection.insertOne({
      name: 'Super Admin',
      email: 'superadmin@estate.com',
      password: hashedPassword,
      role: 'super_admin',
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    })
    
    console.log('✅ Super Admin created successfully!')
    console.log('📧 Email: superadmin@estate.com')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error creating super admin:', error)
  } finally {
    await client.close()
  }
}

createSuperAdmin()