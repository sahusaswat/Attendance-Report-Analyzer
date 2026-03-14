import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";

function SaaSDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Navbar */}

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

    {/* Logo */}
    <div className="flex items-center gap-2 sm:gap-3">

      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
        A
      </div>

      <div>
        <h1 className="text-sm sm:text-lg font-semibold text-gray-800">
          AttendPro
        </h1>

        <p className="text-xs text-gray-500 hidden sm:block">
          Organization Workspace
        </p>
      </div>

    </div>

    {/* Logout */}
    <div className="scale-90 sm:scale-100">
      <LogoutButton />
    </div>

  </div>

</header>

      {/* Main */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Heading */}

        <div className="mb-8 sm:mb-12">

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Organization Workspace
          </h2>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your organizations or join a new one.
          </p>

        </div>

        {/* Cards */}

        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {/* Create Organization */}

          <Link to="/create" className="group">

            <div className="h-full rounded-xl p-5 sm:p-6 shadow-md bg-blue-500 text-white hover:bg-blue-600 transition transform hover:-translate-y-1 flex flex-col">

              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white/20 flex items-center justify-center font-bold mb-3 sm:mb-4">
                +
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Create Organization
              </h3>

              <p className="text-blue-100 text-sm">
                Start a workspace and manage your team members.
              </p>

            </div>

          </Link>

          {/* Join Organization */}

          <Link to="/join" className="group">

            <div className="h-full rounded-xl p-5 sm:p-6 shadow-md bg-green-500 text-white hover:bg-green-600 transition transform hover:-translate-y-1 flex flex-col">

              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white/20 flex items-center justify-center font-bold mb-3 sm:mb-4">
                J
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Join Organization
              </h3>

              <p className="text-green-100 text-sm">
                Join an organization using an invite code.
              </p>

            </div>

          </Link>

          {/* Enter Organization */}

          <Link to="/my-org" className="group">

            <div className="h-full rounded-xl p-5 sm:p-6 shadow-md bg-purple-500 text-white hover:bg-purple-600 transition transform hover:-translate-y-1 flex flex-col">

              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white/20 flex items-center justify-center font-bold mb-3 sm:mb-4">
                →
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">
                Enter Organization
              </h3>

              <p className="text-purple-100 text-sm">
                Access your dashboard and manage attendance.
              </p>

            </div>

          </Link>

        </div>

      </main>

    </div>
  );
}

export default SaaSDashboard;