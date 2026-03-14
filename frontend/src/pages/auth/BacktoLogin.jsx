import React from "react";
import { Link } from "react-router-dom";

function BacktoLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md text-center">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Session Expired
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Your session has expired or you are not authorized to access this page.
          Please login again to continue.
        </p>

        <Link to="/login">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition duration-200">
            Go Back to Login
          </button>
        </Link>

      </div>

    </div>
  );
}

export default BacktoLogin;