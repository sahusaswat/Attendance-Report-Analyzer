import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItem = (path, label) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full text-left px-4 py-2 rounded-lg transition 
        ${active
          ? "bg-purple-500 text-white"
          : "text-gray-700 hover:bg-purple-200"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm fixed left-0 top-0 flex flex-col">

      {/* Logo / Title */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-purple-600">
          AttendPro
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2 p-4">

        {navItem("/dashboardredirect", "Dashboard")}

        {navItem("/attendance", "Attendance")}

        {navItem("/performance", "View Performance")}

        {navItem("/assignments", "Team Management")}

      </div>

    </div>
  );
}

export default Navbar;