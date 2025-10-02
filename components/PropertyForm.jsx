// components/PropertyForm.jsx
'use client'
import { useState, useRef } from 'react'

export default function PropertyForm({ onSuccess, property }) {
  const [formData, setFormData] = useState(property || {
    title: '',
    description: '',
    type: 'house',
    price: '',
    location: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    images: [],
    videos: [],
    coordinates: {
      lat: '',
      lng: ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingVideos, setUploadingVideos] = useState(false)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target
    let updatedAmenities = [...formData.amenities]
    
    if (checked) {
      updatedAmenities.push(value)
    } else {
      updatedAmenities = updatedAmenities.filter(item => item !== value)
    }
    
    setFormData({
      ...formData,
      amenities: updatedAmenities
    })
  }

// In your PropertyForm component, update the upload functions:

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (files.length === 0) return

  setUploadingImages(true)
  setError('')

  try {
    const uploadPromises = files.map(async (file) => {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`)
      }

      if (!file.type.startsWith('image/')) {
        throw new Error(`File ${file.name} is not an image.`)
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      return data
    })

    const results = await Promise.all(uploadPromises)
    const newImageUrls = results.map(result => result.imageUrl)

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }))

  } catch (error) {
    console.error('Image upload error:', error)
    setError(error.message)
  } finally {
    setUploadingImages(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
}

const handleVideoUpload = async (e) => {
  const files = Array.from(e.target.files)
  if (files.length === 0) return

  setUploadingVideos(true)
  setError('')

  try {
    const uploadPromises = files.map(async (file) => {
      if (file.size > 50 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large. Maximum size is 50MB.`)
      }

      if (!file.type.startsWith('video/')) {
        throw new Error(`File ${file.name} is not a video.`)
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      return data
    })

    const results = await Promise.all(uploadPromises)
    const newVideoUrls = results.map(result => result.imageUrl)

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...newVideoUrls]
    }))

  } catch (error) {
    console.error('Video upload error:', error)
    setError(error.message)
  } finally {
    setUploadingVideos(false)
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }
}

 

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData.title || !formData.description || !formData.price) {
      setError('Title, description, and price are required')
      setIsLoading(false)
      return
    }

    try {
      const url = property 
        ? `/api/properties/${property._id}`
        : '/api/properties'
      
      const method = property ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      onSuccess && onSuccess(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{property ? 'Edit Property' : 'Add New Property'}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Property Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Property Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (R) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms *
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              required
              min="0"
              value={formData.bedrooms}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Bathrooms *
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              required
              min="0"
              value={formData.bathrooms}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">
            Area (sq ft) *
          </label>
          <input
            type="number"
            id="area"
            name="area"
            required
            min="0"
            value={formData.area}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Coordinates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
              Latitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              id="lat"
              name="lat"
              value={formData.coordinates.lat}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                coordinates: { ...prev.coordinates, lat: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., -1.2921"
            />
          </div>
          
          <div>
            <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
              Longitude (Optional)
            </label>
            <input
              type="number"
              step="any"
              id="lng"
              name="lng"
              value={formData.coordinates.lng}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                coordinates: { ...prev.coordinates, lng: e.target.value }
              }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 36.8219"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['wifi', 'parking', 'pool', 'gym', 'air-conditioning', 'heating', 'laundry', 'pet-friendly'].map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={amenity}
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={amenity} className="ml-2 block text-sm text-gray-900 capitalize">
                  {amenity.replace('-', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Images
          </label>
          
          {formData.images.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Images ({formData.images.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageUrl} 
                      alt={`Property image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="property-images"
            />
            <label
              htmlFor="property-images"
              className="cursor-pointer block"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {uploadingImages ? 'Uploading Images...' : 'Upload Images'}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </span>
            </label>
          </div>
        </div>

        {/* Video Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Videos
          </label>
          
          {formData.videos.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Videos ({formData.videos.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.videos.map((videoUrl, index) => (
                  <div key={index} className="relative group">
                    <video 
                      src={videoUrl}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={videoInputRef}
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="property-videos"
            />
            <label
              htmlFor="property-videos"
              className="cursor-pointer block"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {uploadingVideos ? 'Uploading Videos...' : 'Upload Videos'}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                MP4, MOV up to 50MB each
              </span>
            </label>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || uploadingImages || uploadingVideos}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (property ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>
    </div>
  )
}