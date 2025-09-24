// app/api/health/route.js
export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}