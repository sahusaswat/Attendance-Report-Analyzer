import React from 'react'
import { Link } from 'react-router-dom'

function Verified  ()  {

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Email Verified!
        </h1>

        <p className="text-gray-600 mb-6">
          Your account is now verified.
        </p>

        <Link
          to="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </Link>

      </div>

    </div>
    </>
  )
}

export default Verified
