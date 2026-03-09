import React from "react";
import LogoutButton from "../../components/LogoutButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Navbar from "../../components/Navbar.jsx";
import Loader from "../../components/Loader.jsx"

function AdminDashboard() {

  const { user, ready } = useAuth();

  if (!ready) {
  return <Loader/>;
}

  return (
    <>
      <Navbar />

      <div className="ml-64 p-10 min-h-screen bg-gray-100">

        {/* Organization Card */}

        <div className="bg-blue-200 shadow-lg rounded-lg p-6 flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              {user?.orgName}
            </h1>

            <p className="text-lg mt-2">
              Code : <span className="font-semibold">{user?.orgCode}</span>
            </p>
          </div>

          <div className="text-right">

            <p className="text-xl font-semibold">
              {user?.name}
            </p>

            <p className="text-gray-700 capitalize">
              {user?.role}
            </p>

            <div className="mt-3">
              <LogoutButton />
            </div>

          </div>

        </div>

        {/* Stats Section */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">
              Today's Snapshot
            </h2>

            <p className="text-3xl font-bold text-green-600">
              #Total Present
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">
              Trend
            </h2>

            <p className="text-3xl font-bold text-blue-600">
              #Positive / Negative
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">
              Members On Leave
            </h2>

            <p className="text-3xl font-bold text-red-500">
              #Leave Count
            </p>
          </div>

        </div>

        {/* Performance Section */}

        <div className="grid grid-cols-2 gap-6">

          {/* Top Performer */}

          <div className="bg-white shadow rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-4">
              Top Performers
            </h2>

            <ul className="space-y-2">

              <li className="bg-green-100 p-2 rounded">
                Employee Name
              </li>

              <li className="bg-green-100 p-2 rounded">
                Employee Name
              </li>

            </ul>

          </div>

          {/* Low Performer */}

          <div className="bg-white shadow rounded-lg p-6">

            <h2 className="text-xl font-semibold mb-4">
              Low Performers
            </h2>

            <ul className="space-y-2">

              <li className="bg-red-100 p-2 rounded">
                Employee Name
              </li>

              <li className="bg-red-100 p-2 rounded">
                Employee Name
              </li>

            </ul>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;