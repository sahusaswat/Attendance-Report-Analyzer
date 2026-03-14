import React from "react";
import { Link } from "react-router-dom";

function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-md text-center">

        {/* Branding */}

        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-purple-600">
            AttendPro
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Smart Attendance & Workforce Insights
          </p>

        </div>

        {/* Card */}

        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">

          {/* Icon */}

          <div className="text-5xl sm:text-6xl mb-4">
            🚫
          </div>

          {/* Title */}

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>

          {/* Description */}

          <p className="text-gray-600 text-sm sm:text-base mb-6">
            You do not have permission to access this page.
            Please login with the correct account.
          </p>

          {/* Button */}

          <Link
            to="/login"
            className="inline-block w-full sm:w-auto px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default NotAuthorized;