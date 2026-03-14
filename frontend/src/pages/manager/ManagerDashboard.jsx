import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";
import Navbar from "../../components/Navbar";

function ManagerDashboard() {

  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const today = new Date().toISOString().split("T")[0];

        const membersRes = await instance.get("/attendance/members");

        const attendanceRes = await instance.get(
          `/attendance/team-attendance?startDate=${today}&endDate=${today}`
        );

        setMembers(membersRes.data?.members || []);
        setAttendance(attendanceRes.data?.attendance || []);

      } catch (error) {

        console.log("Dashboard fetch error:", error);

      }

    };

    fetchData();

  }, []);

  const totalMembers = members.length - 1;

  const present = members.filter(member =>
    attendance.find(a =>
      a.userId?._id?.toString() === member.userId?._id?.toString() &&
      a.status === "present"
    )
  ).length;

  const leave = members.filter(member =>
    attendance.find(a =>
      a.userId?._id?.toString() === member.userId?._id?.toString() &&
      a.status === "leave"
    )
  ).length;

  const late = attendance.filter(a => a.lateStatus === true).length;

  const absent = totalMembers - present - leave;

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <Navbar />

      {/* Main Content */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white shadow px-4 sm:px-6 py-4">

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manager Dashboard
          </h1>

          <LogoutButton />

        </div>

        {/* Page Content */}

        <div className="p-4 sm:p-6">

          {/* Welcome Card */}

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-5 sm:p-6 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Welcome Back, {user?.name} 👋
              </h2>

              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                {user?.orgName}
              </p>

            </div>

            <div className="sm:text-right">

              <p className="text-base sm:text-lg font-semibold">
                Role: {user?.role}
              </p>

            </div>

          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Team Members
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold">
                {totalMembers}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Present Today
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
                {present}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Absent Today
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
                {absent}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Leave Today
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
                {leave}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Late Entries
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600">
                {late}
              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default ManagerDashboard;