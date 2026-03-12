import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false)
  const [name, setname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await instance.post("/auth/register", {
        name,
        email,
        password
      }); 

      alert(res.data.message);

      navigate("/verify-code", {state:{email}});

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
            type={showpassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

           <button
            type="button"
            className="fixed top-112 right-147 -translate-y-1/2 curosr-pointer text-gray-400"
            onClick={() => setshowpassword(!showpassword)}>
            {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

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