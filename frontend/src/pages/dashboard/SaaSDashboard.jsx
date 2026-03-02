import React from 'react'
import { Link } from 'react-router-dom'
import LogoutButton from '../../components/LogoutButton'

function SaaSDashboard () {
  return (
    <>
    <div className='h-auto w-auto p-4 border-purple-300'>
      <button className="w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-1 cursor-pointer"><Link to="/create">Create Organization</Link></button>
      <button className="w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-1 cursor-pointer"><Link to="/join">Join Organization</Link></button>
      <button className="w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-1 cursor-pointer"><Link to="/my-org">Enter Organization</Link></button>
    </div>
    <LogoutButton/>
    </>
  )
}

export default SaaSDashboard
