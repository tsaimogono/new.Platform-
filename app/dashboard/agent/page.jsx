// app/dashboard/agent/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PropertyForm from '../../../components/PropertyForm'
import PropertyList from '../../../components/PropertyList'

export default function AgentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('properties')
  const [profile, setProfile] = useState(null)
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user.role !== 'agent') {
      router.push('/dashboard/client')
      return
    }
    
    fetchProfile()
    fetchProperties()
    setIsLoading(false)
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profiles/me')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setProfileError('')
      } else {
        setProfileError('Failed to load profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfileError('Error loading profile')
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties/my-properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
        setError('')
      } else {
        setError('Failed to fetch properties')
        setProperties([])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('Error fetching properties')
      setProperties([])
    }
  }

  const handlePropertyCreated = () => {
    fetchProperties()
    setActiveTab('properties')
  }

  const handlePropertyUpdated = () => {
    fetchProperties()
  }

  const handlePropertyDeleted = () => {
    fetchProperties()
  }

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      })

      if (response.ok) {
        fetchProfile() // Refresh the profile
        setActiveTab('profile')
      } else {
        setProfileError('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setProfileError('Error updating profile')
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Agent Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'properties' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('properties')}
        >
          My Properties
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('add')}
        >
          Add Property
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>
      
      {activeTab === 'properties' && (
        <PropertyList 
          properties={properties} 
          onUpdate={handlePropertyUpdated}
          onDelete={handlePropertyDeleted}
          isAgent={true}
        />
      )}
      
      {activeTab === 'add' && (
        <PropertyForm onSuccess={handlePropertyCreated} />
      )}
      
      {activeTab === 'profile' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Agency Profile</h2>
          
          {profileError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {profileError}
            </div>
          )}
          
          {profile ? (
            <ProfileForm 
              profile={profile} 
              onUpdate={handleProfileUpdate} 
            />
          ) : (
            <div>Loading profile...</div>
          )}
        </div>
      )}
    </div>
  )
}

// Create a ProfileForm component for editing the profile
function ProfileForm({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await onUpdate(formData)
    setIsLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
            Agency Name
          </label>
          <input
            type="text"
            id="agencyName"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="agencyDescription" className="block text-sm font-medium text-gray-700">
            Agency Description
          </label>
          <textarea
            id="agencyDescription"
            name="agencyDescription"
            rows={4}
            value={formData.agencyDescription}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}