import React, { useEffect, useState } from "react";
import { getAttendanceByUser } from "../../api/attendanceApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LogoutButton from "../../components/LogoutButton.jsx";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar.jsx";

function MemberDashboard() {

  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);

  if (!user?._id) return null;

  /* ===============================
     Fetch Attendance Automatically
  =============================== */

  useEffect(() => {

    const fetchAttendance = async () => {

      try {

        const today = new Date();

        const start = new Date(
          today.getFullYear(),
          0,
          1
        ).toISOString().split("T")[0];

        const end = today.toISOString().split("T")[0];

        const res = await getAttendanceByUser(
          user._id,
          start,
          end
        );

        setAttendance(res.attendance);

      } catch (error) {

        toast.error("Failed to load attendance");

      }

    };

    fetchAttendance();

  }, [user]);

  const presentDays = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const absentDays = attendance.filter(
    (a) => a.status === "absent"
  ).length;

  const lateDays = attendance.filter(
    (a) => a.lateStatus
  ).length;

  const attendanceRate =
    attendance.length === 0
      ? 0
      : Math.round((presentDays / attendance.length) * 100);

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white shadow px-4 sm:px-6 py-4">

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Member Dashboard
          </h1>

          <LogoutButton />

        </div>

        {/* Page Content */}

        <div className="p-4 sm:p-6">

          {/* Welcome Card */}

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 sm:p-6 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Welcome back, {user?.name} 👋
              </h2>

              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                {user?.orgName}
              </p>

              <p className="text-blue-100 text-sm sm:text-base">
                Role: {user?.role}
              </p>

            </div>

            <div className="sm:text-right">

              <p className="text-sm text-blue-100">
                Attendance Rate
              </p>

              <p className="text-2xl sm:text-3xl font-bold">
                {attendanceRate}%
              </p>

            </div>

          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Present Days
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
                {presentDays}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Absent Days
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
                {absentDays}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Late Days
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {lateDays}
              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default MemberDashboard;