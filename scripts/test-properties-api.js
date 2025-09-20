// scripts/test-properties-api.js
require('dotenv').config({ path: '.env.local' })

async function testPropertiesAPI() {
  try {
    // Test GET request
    const response = await fetch('http://localhost:3000/api/properties')
    const data = await response.json()
    console.log('GET /api/properties:', response.status, data)
    
    // Test POST request (this will fail without auth, but should return 401, not 405)
    const postResponse = await fetch('http://localhost:3000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Property',
        description: 'Test Description',
        price: 100000,
        type: 'house',
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        location: 'Test Location',
        city: 'Test City'
      })
    })
    
    console.log('POST /api/properties:', postResponse.status, await postResponse.text())
    
  } catch (error) {
    console.error('API test error:', error.message)
  }
}

testPropertiesAPI()