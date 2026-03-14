import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

function SaaSDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navbar */}

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              A
            </div>

            <div className="leading-tight">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                AttendPro
              </h1>

              <p className="text-xs text-gray-500 hidden sm:block">
                Organization Workspace
              </p>
            </div>

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm">
              <LogoutButton />
            </div>
          </div>

        </div>

      </header>

      {/* Main Section */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* Heading */}

        <div className="mb-8 sm:mb-10">

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Organization Workspace
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Manage your organizations or join a new one to start tracking attendance.
          </p>

        </div>

        {/* Action Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Create Organization */}

          <Link to="/create">

            <div className="p-6 sm:p-8 rounded-xl shadow-md bg-blue-500 hover:bg-blue-600 text-white transition transform hover:-translate-y-1">

              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Create Organization
              </h3>

              <p className="text-blue-100 text-sm">
                Start a new workspace and manage your team members.
              </p>

            </div>

          </Link>

          {/* Join Organization */}

          <Link to="/join">

            <div className="p-6 sm:p-8 rounded-xl shadow-md bg-green-500 hover:bg-green-600 text-white transition transform hover:-translate-y-1">

              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Join Organization
              </h3>

              <p className="text-green-100 text-sm">
                Join an existing organization using an invite code.
              </p>

            </div>

          </Link>

          {/* Enter Organization */}

          <Link to="/my-org">

            <div className="p-6 sm:p-8 rounded-xl shadow-md bg-purple-500 hover:bg-purple-600 text-white transition transform hover:-translate-y-1">

              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Enter Organization
              </h3>

              <p className="text-purple-100 text-sm">
                Access your organization dashboard and manage attendance.
              </p>

            </div>

          </Link>

        </div>

      </main>

    </div>
  );
}

export default SaaSDashboard;