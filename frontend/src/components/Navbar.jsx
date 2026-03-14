import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role || "member";

  const [open, setOpen] = useState(false);

  const menus = {
    admin: [
      { path: "/admin", label: "Dashboard" },
      { path: "/attendance", label: "Attendance" },
      { path: "/performance", label: "View Performance" },
      { path: "/assignments", label: "Team Management" },
      { path: "/team-attendance", label: "Team Attendance" },
      { path: "/editrecords", label: "Edit Records" },
      { path: "/dashboard", label: "Home Page" }
    ],

    manager: [
      { path: "/manager", label: "Dashboard" },
      { path: "/attendance", label: "Attendance" },
      { path: "/team-attendance", label: "Team Attendance" },
      { path: "/self-attendance", label: "My Attendance" },
      { path: "/editrecords", label: "Edit Records" },
      { path: "/dashboard", label: "Home Page" }
    ],

    member: [
      { path: "/member", label: "Dashboard" },
      { path: "/self-attendance", label: "My Attendance" },
      { path: "/dashboard", label: "Home Page" }
    ]
  };

  const navItem = (path, label) => {
    const active = location.pathname.startsWith(path);

    return (
      <button
        key={path}
        onClick={() => {
          navigate(path);
          setOpen(false);
        }}
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
    <>
      {/* MOBILE TOPBAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed w-full z-40">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          A
        </div>
        <h1 className="text-lg font-bold text-purple-600">
          AttendPro
        </h1>

        <button onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        transition-transform duration-300 z-30`}
      >

        <div className="p-6 border-b hidden md:block">
          <h1 className="text-xl font-bold text-purple-600">
            AttendPro
          </h1>
        </div>

        <div className="flex flex-col gap-2 p-4 mt-14 md:mt-0">
          {menus[role].map((item) => navItem(item.path, item.label))}
        </div>

      </div>
    </>
  );
}

export default Navbar;