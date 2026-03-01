import React from 'react'
import { Link } from 'react-router-dom'

function NotAuthorized () {
  return (
    <div className='h-full w-full flex justify-center items-center text-gray-400 font-serif'>
      <h1>Not Authorized</h1>
      <h3>Back to Login</h3>
      <button className='text-purple-600 underline mt-4 h-10 w-40 bg-blue-200 rounded-md shadow-2xs cursor-pointer'><Link to="/login">Login</Link></button>
    </div>
  )
}

export default NotAuthorized
