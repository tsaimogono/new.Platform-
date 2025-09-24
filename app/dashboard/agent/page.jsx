// app/dashboard/agent/page.jsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PropertyForm from '../../../components/PropertyForm'
import PropertyList from '../../../components/PropertyList.jsx'

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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your properties and agency profile</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'properties'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Properties
            {properties.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {properties.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add New Property
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Agency Profile
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Properties</h2>
              <button
                onClick={() => setActiveTab('add')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add New Property
              </button>
            </div>
            <PropertyList 
              properties={properties} 
              onUpdate={handlePropertyUpdated}
              onDelete={handlePropertyDeleted}
              isAgent={true}
            />
          </div>
        )}
        
        {activeTab === 'add' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Property</h2>
            <PropertyForm onSuccess={handlePropertyCreated} />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Agency Profile</h2>
            
            {profileError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {profileError}
              </div>
            )}
            
            {profile ? (
              <ProfileForm 
                profile={profile} 
                onUpdate={handleProfileUpdate} 
              />
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Profile Form Component
function ProfileForm({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile || {
    agencyName: '',
    agencyDescription: '',
    phone: '',
    address: '',
    profilePicture: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    setError('')

    try {
      // Check file size (max 2MB for profile pictures)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Profile picture is too large. Maximum size is 2MB.')
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file.')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      setFormData(prev => ({
        ...prev,
        profilePicture: result.imageUrl
      }))

    } catch (error) {
      setError(error.message)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await onUpdate(formData)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        {/* Profile Picture Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {formData.profilePicture ? (
                <>
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                id="profile-picture"
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {uploadingImage ? 'Uploading...' : 'Change Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Agency Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="Enter your agency name"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
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
            placeholder="Describe your agency services and specialties"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Agency Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your agency's physical address"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData(profile)
              setError('')
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading || uploadingImage}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}