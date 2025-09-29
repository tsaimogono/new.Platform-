// components/StaticMap.jsx
'use client'
import { useEffect, useState } from 'react'

export default function StaticMap({ location, city, className = "h-64" }) {
  const [mapUrl, setMapUrl] = useState('')

  useEffect(() => {
    // Generate static map image URL
    const query = `${location}, ${city}`.replace(/ /g, '+')
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${query}&zoom=14&size=600x400&markers=color:red%7C${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    setMapUrl(url)
  }, [location, city])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Map not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <img 
        src={mapUrl} 
        alt={`Location of ${location}`}
        className="w-full h-full object-cover"
      />
    </div>
  )
}