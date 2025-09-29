// components/PropertyMap.jsx
'use client'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
}

export default function PropertyMap({ properties = [], singleProperty = null }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [map, setMap] = useState(null)

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>Google Maps API key not configured</p>
          <p className="text-sm mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to environment variables</p>
        </div>
      </div>
    )
  }

  if (singleProperty) {
    const position = singleProperty.coordinates && singleProperty.coordinates.lat && singleProperty.coordinates.lng 
      ? { lat: parseFloat(singleProperty.coordinates.lat), lng: parseFloat(singleProperty.coordinates.lng) }
      : defaultCenter
    
    return (
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={position}
        >
          <Marker
            position={position}
            title={singleProperty.title}
          />
        </GoogleMap>
      </LoadScript>
    )
  }

  const validProperties = properties.filter(property => 
    property.coordinates && 
    property.coordinates.lat && 
    property.coordinates.lng
  )

  if (validProperties.length === 0) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>No properties with location data available</p>
        </div>
      </div>
    )
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={defaultCenter}
        onLoad={map => setMap(map)}
      >
        {validProperties.map((property, index) => {
          const position = {
            lat: parseFloat(property.coordinates.lat),
            lng: parseFloat(property.coordinates.lng)
          }
          
          return (
            <Marker
              key={property._id || index}
              position={position}
              title={property.title}
              onClick={() => setSelectedProperty(property)}
            />
          )
        })}

        {selectedProperty && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedProperty.coordinates.lat),
              lng: parseFloat(selectedProperty.coordinates.lng)
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-sm mb-1">{selectedProperty.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{selectedProperty.location}</p>
              <p className="text-sm font-bold text-blue-600">
                ${selectedProperty.price?.toLocaleString()}
              </p>
              <div className="flex space-x-2 mt-2">
                <a
                  href={`/properties/${selectedProperty._id}`}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}