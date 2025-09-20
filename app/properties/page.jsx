// app/properties/page.jsx
'use client'
import { useState, useEffect } from 'react'
import PropertyList from '../../components/PropertyList'
import SearchFilters from '../../components/SearchFilter'

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

  useEffect(() => {
    fetchProperties()
  }, [searchFilters])

  const fetchProperties = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      
      const response = await fetch(`/api/properties?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
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
        <PropertyList 
          properties={properties} 
          favorites={favorites}
          isAgent={false}
        />
      </div>
    </div>
  )
}