import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import { Eye, EyeOff } from "lucide-react";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await instance.post("/auth/register", {
        name,
        email,
        password
      });

      navigate("/verify-code", { state: { email } });

    } catch (err) {

      setError(err.response?.data?.message || "Signup Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-md">

        {/* SaaS Branding */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            AttendPro
          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Smart Attendance & Workforce Insights
          </p>

        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />

            {/* Password */}
            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm sm:text-base"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium transition
                ${loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 border-t"></div>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;