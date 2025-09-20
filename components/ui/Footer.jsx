// components/ui/Footer.jsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">RealEstate</h3>
            <p className="text-gray-300">
              Find your dream home with our real estate platform. Browse thousands of properties for sale and rent.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="text-gray-300 hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-gray-300 hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>123 Real Estate Street</p>
              <p>City, State 12345</p>
              <p>Email: info@realestate.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}