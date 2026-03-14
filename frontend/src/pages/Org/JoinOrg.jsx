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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center px-4">

      {/* SaaS Logo */}

      <div className="flex items-center gap-3 mb-6 sm:mb-8">

        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          A
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            AttendPro
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Attendance Management SaaS
          </p>
        </div>

      </div>

      {/* Card */}

      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md">

        <h2 className="text-lg sm:text-xl font-semibold text-center mb-5 sm:mb-6">
          Join Organization
        </h2>

        <form onSubmit={handleJoin} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Organization Code"
            value={code}
            onChange={(e) => setcode(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
          >
            Join Organization
          </button>

        </form>

        {/* Divider */}

        <div className="my-6 border-t"></div>

        <Link
          to="/dashboard"
          className="block text-center text-green-600 font-medium text-sm sm:text-base hover:underline"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default JoinOrg;