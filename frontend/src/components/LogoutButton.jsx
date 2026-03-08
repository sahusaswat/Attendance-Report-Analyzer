import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();

    const handlelogout = async () => {
        await logout();
        navigate("/login")
    }
  return (
    <div>
      <button className="text-purple-600 underline mt-4 h-10 w-40 bg-blue-200 rounded-md shadow-2xs cursor-pointer"
        onClick={handlelogout}>
        Logout
        </button>
    </div>
  )
}

export default LogoutButton
