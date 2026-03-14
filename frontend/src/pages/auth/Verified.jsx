import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function Verified() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-md text-center">

        {/* Branding */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            AttendPro
          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Smart Attendance & Workforce Insights
          </p>

        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">

          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <CheckCircle size={60} className="text-green-500" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Email Verified
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Your account has been successfully verified.  
            You can now login and start managing your organization.
          </p>

          {/* Login Button */}
          <Link
            to="/login"
            className="inline-block w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Verified;