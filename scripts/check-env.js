// scripts/check-env.js
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
]

console.log('🔍 Checking environment variables...')

let missingVars = []
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingVars.push(envVar)
    console.error(`❌ Missing: ${envVar}`)
  } else {
    console.log(`✅ Found: ${envVar}`)
  }
})

if (missingVars.length > 0) {
  console.error('\n🚨 Missing required environment variables:')
  missingVars.forEach(envVar => {
    console.error(`   - ${envVar}`)
  })
  console.error('\n💡 Please set these variables in your Vercel project settings.')
  process.exit(1)
}

console.log('✅ All required environment variables are set!')