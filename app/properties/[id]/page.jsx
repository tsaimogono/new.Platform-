// app/properties/[id]/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PropertyMap from '../../../components/PropertyMap'
import StaticMap from '../../../components/StaticMap'

export default function PropertyDetail() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [property, setProperty] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeMedia, setActiveMedia] = useState('images')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

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
        fetchFavorites()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property details...</p>
          </div>
        </div>
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
  const hasCoordinates = property.coordinates && property.coordinates.lat && property.coordinates.lng
  const coordinates = hasCoordinates ? property.coordinates : null

  const currentImage = property.images?.[selectedImageIndex]
  const currentVideo = property.videos?.[selectedVideoIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Media Gallery */}
        <div className="relative">
          {/* Media Type Toggle */}
          {(property.images?.length > 0 || property.videos?.length > 0) && (
            <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md">
              {property.images?.length > 0 && (
                <button
                  onClick={() => {
                    setActiveMedia('images')
                    setSelectedImageIndex(0)
                  }}
                  className={`px-4 py-2 rounded-l-lg ${
                    activeMedia === 'images' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Images ({property.images.length})
                </button>
              )}
              {property.videos?.length > 0 && (
                <button
                  onClick={() => {
                    setActiveMedia('videos')
                    setSelectedVideoIndex(0)
                  }}
                  className={`px-4 py-2 rounded-r-lg ${
                    activeMedia === 'videos' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Videos ({property.videos.length})
                </button>
              )}
            </div>
          )}

          {/* Favorite Button */}
          {session && session.user.role === 'client' && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
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

          {/* Main Media Display */}
          {activeMedia === 'images' && property.images && property.images.length > 0 ? (
            <div className="h-96 relative">
              <img 
                src={currentImage} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % property.images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ) : activeMedia === 'videos' && property.videos && property.videos.length > 0 ? (
            <div className="h-96 relative">
              <video 
                src={currentVideo}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
              />
              
              {/* Video Navigation */}
              {property.videos.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedVideoIndex((prev) => (prev - 1 + property.videos.length) % property.videos.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedVideoIndex((prev) => (prev + 1) % property.videos.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No {activeMedia} available</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
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

          {/* Location Map Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                <strong>Address:</strong> {property.location}, {property.city}
              </p>
              
              {hasCoordinates ? (
                <div className="h-96 rounded-lg overflow-hidden">
                  <PropertyMap singleProperty={property} />
                </div>
              ) : (
                <div className="h-64 rounded-lg overflow-hidden">
                  <StaticMap 
                    location={property.location} 
                    city={property.city}
                  />
                </div>
              )}
              
              {!hasCoordinates && (
                <p className="text-sm text-gray-500 mt-2">
                  <em>Exact coordinates not available. Showing approximate location.</em>
                </p>
              )}
            </div>
          </div>

          {/* Video Gallery Section */}
          {property.videos && property.videos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Property Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.videos.map((videoUrl, index) => (
                  <div key={index} className="bg-black rounded-lg overflow-hidden">
                    <video 
                      src={videoUrl}
                      className="w-full h-64 object-cover"
                      controls
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}