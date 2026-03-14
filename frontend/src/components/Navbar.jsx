import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role || "member";

  const menus = {
    admin: [
      { path: "/admin", label: "Dashboard" },
      { path: "/attendance", label: "Attendance" },
      { path: "/performance", label: "View Performance" },
      { path: "/assignments", label: "Team Management" },
      { path: "/team-attendance", label: "Team Attendance" },
      { path: "/editrecords", label: "Edit Records" },
      //   { path: "/", label: "Generate Payslip" },
      //   { path: "/", label: "Notification" },
      //   { path: "/", label: "Analyzer" },
      //   { path: "/", label: "AI Bot" },
      //   { path: "/", label: "Settings" },
      //   { path: "/", label: "Feedback" }
    ],

    manager: [
      { path: "/manager", label: "Dashboard" },
      { path: "/attendance", label: "Attendance" },
      { path: "/team-attendance", label: "Team Attendance" },
      { path: "/self-attendance", label: "My Attendance" },
      // { path: "/", label: "Notification" },
      // { path: "/", label: "Feedback" }
    ],

    member: [
      { path: "/member", label: "Dashboard" },
      { path: "/self-attendance", label: "My Attendance" },
      // { path: "/", label: "My Performance" },
      // { path: "/", label: "Feedback" }
    ]
  }
  const navItem = (path, label) => {
    const active = location.pathname.startsWith(path);

    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full text-left px-4 py-2 rounded-lg transition 
        ${active
            ? "bg-violet-500 text-white"
            : "text-gray-700 hover:bg-purple-200"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm fixed left-0 top-0 flex flex-col">

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-purple-600">
          AttendPro
        </h1>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {menus[role].map((item) =>
          <React.Fragment key={item.path + item.label}>
            {navItem(item.path, item.label)}
          </React.Fragment>
        )}
      </div>

    </div>
  );
}

export default Navbar;