import React from 'react'
import { Link } from 'react-router-dom'
const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto text-center">
        <img src="https://thumbs.dreamstime.com/z/404-error-sign-16655756.jpg" alt="Page Not Found" className="mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-500 mb-6">The page you are looking for does not exist.</p>
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</Link>
      </div>
    </div>
  )
}

export default NotFound