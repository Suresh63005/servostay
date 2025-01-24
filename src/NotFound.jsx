import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-[#EAEAFF]">
      <div className="max-w-lg text-center p-8  rounded-xl shadow-lg">
        <img
          src="/image/Frame 1984078701.png"
          alt="Page Not Found"
          className="mx-auto mb-6 animate-bounce"
        />
        <h2 className="text-4xl font-extrabold  mb-4">Oops! Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-8">
          It seems like the page you're looking for doesn't exist. But don't worry, let's get you back on track.
        </p>
        <Link
          to="/"
          className="bg-[#045D78] text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#023C4B] transition duration-300 no-underline"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFound
