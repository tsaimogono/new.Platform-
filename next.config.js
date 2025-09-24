// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'example.com'], 
    unoptimized: true, // Required for static export if using Next.js Image optimization
  },
  trailingSlash: true,
  output: 'standalone', // Recommended for production
  // If you're using static export (optional)
  // output: 'export',
  // distDir: 'out',
}

module.exports = nextConfig