import React from "react";
import { Link } from "react-router-dom";

function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Error Icon */}
      <div className="text-6xl mb-4">🚫</div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Access Denied
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-center max-w-md">
        You do not have permission to access this page.  
        Please login with the correct account.
      </p>

      {/* Button */}
      <Link
        to="/login"
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"
      >
        Back to Login
      </Link>

    </div>
  );
}

export default NotAuthorized;