// app/dashboard/client/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PropertyList from '../../../components/PropertyList'
import SearchFilters from '../../../components/SearchFilter'

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user.role !== 'client') {
      router.push('/dashboard/agent')
      return
    }
    
    fetchProperties()
    fetchFavorites()
  }, [session, status, router, searchFilters])

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

  const fetchFavorites = async () => {
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

  const handleToggleFavorite = async (propertyId) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId }),
      })
      
      if (response.ok) {
        fetchFavorites() // Refresh favorites
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Client Dashboard</h1>
      
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
        <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
        <PropertyList 
          properties={properties} 
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          isAgent={false}
        />
      </div>
    </div>
  )
}