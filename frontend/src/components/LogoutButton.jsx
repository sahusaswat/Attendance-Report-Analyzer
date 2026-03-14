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
      flex items-center justify-center
      px-4 py-2 sm:px-5 sm:py-2.5
      text-sm sm:text-base
      bg-blue-500 text-white
      rounded-lg shadow-sm
      hover:bg-blue-600 hover:shadow-md
      transition duration-200
      cursor-pointer
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;