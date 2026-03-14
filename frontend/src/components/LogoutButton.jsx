import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="
      w-full sm:w-auto
      flex items-center justify-center gap-2
      px-5 py-3
      text-sm sm:text-base
      bg-blue-500 text-white
      rounded-lg shadow
      hover:bg-blue-600 hover:shadow-md
      transition-all duration-200
      cursor-pointer
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;