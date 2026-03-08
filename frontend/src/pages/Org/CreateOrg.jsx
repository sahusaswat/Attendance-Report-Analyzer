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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Create Your Organization
        </h1>

        <p className="text-gray-600 mt-2">
          Manage attendance easily and monitor everything in one place.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Organization Setup
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">

          <input
            type="text"
            required
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Create Organization
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 border-t"></div>

        {/* Dashboard Redirect */}
        <Link
          to="/dashboardredirect"
          className="block text-center text-purple-600 font-medium hover:underline"
        >
          Go to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default CreateOrg;