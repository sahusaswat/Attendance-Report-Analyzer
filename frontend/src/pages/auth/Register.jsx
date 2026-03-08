import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

function Signup() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const { setuser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/auth/register", {
        name,
        email,
        password
      });

      const res = await instance.get("/auth/me");

      setuser(res.data.user);

      navigate("/dashboardredirect");

    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Page Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Create Your Account
        </h1>

        <p className="text-gray-600 mt-2">
          Start managing your organization in minutes.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 border-t"></div>

        {/* Login Link */}
        <p className="text-center text-gray-600">
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
  );
}

export default Signup;