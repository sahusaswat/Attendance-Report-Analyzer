import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import instance from "../../api/axiosApi";
import { Link, useNavigate } from "react-router-dom";

function CreateOrg() {
  const [name, setname] = useState("");
  const navigate = useNavigate();
  const { setuser } = useAuth();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/org/create", { name });

      const res = await instance.get("/auth/me");

      setuser({
        ...res.data.user,
        orgId: res.data.orgId,
        role: res.data.role,
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data.message || "Organization Creation Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4">

      {/* SaaS Logo + Name */}

      <div className="flex items-center gap-3 mb-6 sm:mb-8">

        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
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

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5 sm:mb-6">
          Create Organization
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Create Organization
          </button>

        </form>

        {/* Divider */}

        <div className="my-6 border-t"></div>

        {/* Dashboard Link */}

        <Link
          to="/dashboard"
          className="block text-center text-blue-600 font-medium text-sm sm:text-base hover:underline"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
}

export default CreateOrg;