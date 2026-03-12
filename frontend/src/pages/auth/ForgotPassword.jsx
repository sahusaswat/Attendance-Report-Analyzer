import React from 'react'
import { useState } from 'react'
import instance from '../../api/axiosApi'

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      const res = await instance.post("/auth/forgotpassword", { email });
      alert(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!")
    } finally {
      setloading(false)
    }
  }
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

        <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Forgot Password
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
            >
              Send Reset Link
            </button>

          </form>

          {/* Message */}
          {message && (
            <p className="text-center text-sm text-green-600 mt-4">
              {message}
            </p>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-blue-600 text-sm hover:underline"
            >
              Back to Login
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ResetPassword
