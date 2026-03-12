import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import instance from '../../api/axiosApi'

function ResetPassword () {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

const handleSubmit = async(e) => {
        e.prevetDefault();
        try{
            const res = await instance.post("/forgotpassword", email)
        } catch (error) {
           setMessage(error.response?.data?.message || "Something went wrong!")
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input type="email"
        value={email}
        onChange={(e)=> {setEmail(e.target.value)}}
        placeholder='email' />

        <button>Send Reset Link</button>
        {message && (
          <p className="text-center text-sm mt-4">
            {message}
          </p>
        )}
        </form>
    </div>
  )
}

export default ResetPassword
