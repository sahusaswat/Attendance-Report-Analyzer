import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

function SaaSDashboard() {
  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50">

      {/* Redesigned Navbar */}

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-lg  from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              A
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                AttendPro
              </h1>
              <p className="text-xs text-gray-500">
                Organization Workspace
              </p>
            </div>

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-4">
            <div className="bg-white/80 px-3 py-1 rounded-lg">
              <LogoutButton />
            </div>

          </div>

        </div>
      </header>

      {/* Main Section */}

      <div className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Organization Workspace
        </h2>

        <p className="text-gray-500 mb-10">
          Manage your organizations or join a new one to start tracking attendance.
        </p>

        {/* Action Cards */}

        <div className="grid md:grid-cols-3 gap-8">

          {/* Create Organization */}

          <Link to="/create">
            <div className="p-8 rounded-xl shadow-md bg-blue-500 hover:bg-blue-600 text-white transition transform hover:-translate-y-1 cursor-pointer">

              <h3 className="text-xl font-semibold mb-2">
                Create Organization
              </h3>

              <p className="text-blue-100 text-sm">
                Start a new workspace and manage your team members.
              </p>

            </div>
          </Link>

          {/* Join Organization */}

          <Link to="/join">
            <div className="p-8 rounded-xl shadow-md bg-green-500 hover:bg-green-600 text-white transition transform hover:-translate-y-1 cursor-pointer">

              <h3 className="text-xl font-semibold mb-2">
                Join Organization
              </h3>

              <p className="text-green-100 text-sm">
                Join an existing organization using an invite code.
              </p>

            </div>
          </Link>

          {/* Enter Organization */}

          <Link to="/my-org">
            <div className="p-8 rounded-xl shadow-md bg-purple-500 hover:bg-purple-600 text-white transition transform hover:-translate-y-1 cursor-pointer">

              <h3 className="text-xl font-semibold mb-2">
                Enter Organization
              </h3>

              <p className="text-purple-100 text-sm">
                Access your organization dashboard and manage attendance.
              </p>

            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SaaSDashboard;