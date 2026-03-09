import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import instance from "../../api/axiosApi";
import { useNavigate, Link } from "react-router-dom";

function JoinOrg() {
  const [code, setcode] = useState("");
  const { setuser } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/org/join", { code });

      const res = await instance.get("/auth/me");

      setuser({
        ...res.data.user,
        orgId: res.data.orgId,
        role: res.data.role
      });

      navigate("/dashboardredirect");

    } catch (error) {
      alert("Joining Failed Invalid Code");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Page Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Join an Organization
        </h1>

        <p className="text-gray-600 mt-2">
          Enter the organization code provided by your admin.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Join Organization
        </h2>

        <form onSubmit={handleJoin} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Organization Code"
            value={code}
            onChange={(e) => setcode(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Join Organization
          </button>
          <Link
          to="/dashboardredirect"
          className="block text-center text-purple-600 font-medium hover:underline"
        >
          Go to Dashboard
        </Link>

        </form>

      </div>
    </div>
  );
}

export default JoinOrg;