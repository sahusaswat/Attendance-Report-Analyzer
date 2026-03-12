import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const { setuser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/auth/login", {
        email,
        password
      });

      const res = await instance.get("/auth/me");

      setuser({
        ...res.data.user,
        orgId: res.data.orgId,
        role: res.data.role
      });

      navigate("/dashboardredirect", { replace: true });

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome Back
        </h1>

        <p className="text-gray-600 mt-2">
          Login to continue managing your organization.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

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
            Login
          </button>

        </form>

        <button className="text-blue-500"><Link to={"/forgotpassword"}>ForgotPassword?</Link></button>

        {/* Divider */}
        <div className="my-6 border-t"></div>

        {/* Register Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;