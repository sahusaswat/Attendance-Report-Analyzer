import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

function SaaSDashboard() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">

      {/* Dashboard Card */}

      <div className="bg-white shadow-lg rounded-lg p-10 w-120 text-center">

        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          Organization Dashboard
        </h1>

        <div className="flex flex-col gap-4">

          <Link to="/create">
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold shadow cursor-pointer">
              Create Organization
            </button>
          </Link>

          <Link to="/join">
            <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold shadow cursor-pointer">
              Join Organization
            </button>
          </Link>

          <Link to="/my-org">
            <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-semibold shadow cursor-pointer">
              Enter Organization
            </button>
          </Link>

        </div>

        {/* Logout */}

        <div className="mt-8">
          <LogoutButton />
        </div>

      </div>

    </div>
  );
}

export default SaaSDashboard;