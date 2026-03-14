import React, { useState } from "react";
import { Link } from "react-router-dom";
import instance from "../../api/axiosApi";

function ResetPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await instance.post("/auth/forgotpassword", { email });

      setMessage(res.data.message);

    } catch (error) {

      setMessage(error.response?.data?.message || "Something went wrong");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6 sm:p-8">

        {/* Heading */}
        <div className="text-center mb-6">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
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
            className="w-full p-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition
              ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >

            {loading ? "Sending..." : "Send Reset Link"}

          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-green-600">
            {message}
          </p>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">

          <Link
            to="/login"
            className="text-blue-600 text-sm sm:text-base hover:underline"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;