// app/properties/page.jsx
'use client'
import { useState, useEffect } from 'react'
import PropertyList from '../../components/PropertyList.jsx'
import SearchFilters from '../../components/SearchFilters'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [favorites, setFavorites] = useState([])
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [searchFilters])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams()
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      
      const response = await fetch(`/api/properties?${queryParams}`)
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
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Properties</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <SearchFilters 
        filters={searchFilters} 
        onFilterChange={setSearchFilters} 
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Available Properties ({properties.length})
        </h2>
        <PropertyList 
          properties={properties} 
          favorites={favorites}
          isAgent={false}
        />
      </div>
    </div>
  )
}