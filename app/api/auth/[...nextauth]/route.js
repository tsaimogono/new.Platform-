// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '../../../../lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' } // Add role for super admin login
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection('users')
        
        const user = await usersCollection.findOne({ email: credentials.email })
        
        if (!user) {
          throw new Error('No user found with this email')
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error('Invalid password')
        }

        // Check role authorization for super admin
        if (credentials.role === 'super_admin' && user.role !== 'super_admin') {
          throw new Error('Not authorized as Super Admin')
        }

        // Update last login
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
        )
        
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          agency: user.agency
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.agency = user.agency
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.id = token.id
        session.user.agency = token.agency
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }