// scripts/init-db.js
require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

async function initDatabase() {
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables')
    return
  }

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db()
    
    // Create collections if they don't exist
    const collections = ['users', 'profiles', 'properties', 'favorites']
    
    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext()
      if (!collectionExists) {
        await db.createCollection(collectionName)
        console.log(`✅ Created collection: ${collectionName}`)
      } else {
        console.log(`📁 Collection already exists: ${collectionName}`)
      }
    }
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('profiles').createIndex({ userId: 1 }, { unique: true })
    await db.collection('properties').createIndex({ agentId: 1 })
    await db.collection('favorites').createIndex({ userId: 1, propertyId: 1 }, { unique: true })
    
    console.log('✅ Database initialized successfully')
    await client.close()
  } catch (error) {
    console.error('❌ Database initialization error:', error.message)
  }
}

initDatabase()