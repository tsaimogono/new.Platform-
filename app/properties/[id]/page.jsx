// app/properties/[id]/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ErrorBoundary from '../../../components/ErrorBoundary'

export default function PropertyDetail() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [property, setProperty] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProperty()
    if (session) {
      fetchFavorites()
    }
  }, [id, session])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`)
      if (!response.ok) {
        throw new Error('Property not found')
      }
      const data = await response.json()
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFavorites = async () => {
    if (!session) return
    
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.map(fav => fav.propertyId))
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!session) {
      // Redirect to sign in or show message
      return
    }
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId: id }),
      })
      
      if (response.ok) {
        fetchFavorites() // Refresh favorites
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading property details...</div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'Property not found'}
        </div>
      </div>
    )
  }

  const isFavorite = favorites.includes(property._id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-96">
          {property.images && property.images.length > 0 ? (
            <Image 
              src={property.images[0]} 
              alt={property.title || 'Property image'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
              No Image Available
            </div>
          )}
          
          {session && session.user.role === 'client' && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title || 'Untitled Property'}</h1>
              <p className="text-gray-600 text-lg">
                {property.location || 'Location not specified'}, {property.city || 'City not specified'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                ${property.price ? property.price.toLocaleString() : 'Price not available'}
              </p>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
                {property.type || 'Unknown type'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold">{property.bedrooms || '0'}</p>
              <p className="text-gray-600">Bedrooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{property.bathrooms || '0'}</p>
              <p className="text-gray-600">Bathrooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{property.area || '0'}</p>
              <p className="text-gray-600">Sq Ft</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">
              {property.description || 'No description available for this property.'}
            </p>
          </div>
          
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 capitalize">{amenity.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
            <p className="text-gray-700">
              Please contact the agent for more information about this property.
            </p>
            {property.agentId && (
              <p className="text-gray-600 mt-2">
                <strong>Agent ID:</strong> {property.agentId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}