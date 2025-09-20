// components/PropertyList.jsx
'use client'
import Link from 'next/link'

export default function PropertyList({ properties, favorites = [], onToggleFavorite, isAgent, onUpdate, onDelete }) {
  // Ensure properties is always an array
  const propertiesArray = Array.isArray(properties) ? properties : []
  
  if (propertiesArray.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {propertiesArray.map((property) => (
        <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 relative">
            {property.images && property.images.length > 0 ? (
              <img 
                src={property.images[0]} 
                alt={property.title || 'Property image'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            
            {!isAgent && (
              <button
                onClick={() => onToggleFavorite(property._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label={favorites.includes(property._id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${favorites.includes(property._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{property.title || 'Untitled Property'}</h3>
            <p className="text-gray-600 mb-2">
              {property.location || 'Location not specified'}, {property.city || 'City not specified'}
            </p>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold text-blue-600">
                ${property.price ? property.price.toLocaleString() : '0'}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {property.type || 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{property.bedrooms || '0'} beds</span>
              <span>{property.bathrooms || '0'} baths</span>
              <span>{property.area || '0'} sq ft</span>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-2">
              {property.description || 'No description available.'}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {property.amenities && property.amenities.slice(0, 3).map((amenity) => (
                <span key={amenity} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {amenity.replace('-', ' ')}
                </span>
              ))}
              {property.amenities && property.amenities.length > 3 && (
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
            
            <div className="flex justify-between">
              <Link 
                href={`/properties/${property._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </Link>
              
              {isAgent && (
                <div className="space-x-2">
                  <button
                    onClick={() => onUpdate(property)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(property._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}