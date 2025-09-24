// lib/mongodb.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// In production mode, it's best to not use a global variable
const client = new MongoClient(uri, options)
const clientPromise = client.connect()

// Export a module-scoped MongoClient promise
export default clientPromise