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
        const attendanceRes = await instance.get(`/attendance/team?date=${today}`);

        setMembers(membersRes.data?.members || []);
        setAttendance(attendanceRes.data?.attendance || []);

      } catch (error) {

        console.log("Dashboard fetch error:", error);

      }

    };

    fetchData();

  }, []);

  const totalMembers = members.length + 1; // +1 for manager

  const present = attendance.filter(a => a.status === "present").length;

  const absent = attendance.filter(a => a.status === "absent").length;

  const late = attendance.filter(a => a.lateStatus).length;

  const attendanceRate =
    totalMembers === 0
      ? 0
      : Math.round((present / totalMembers) * 100);

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="ml-64">

        {/* Header */}

        <div className="flex justify-between items-center bg-white shadow px-6 py-4">

          <h1 className="text-2xl font-bold text-gray-800">
            Manager Dashboard
          </h1>

          <LogoutButton />

        </div>

        <div className="p-6">

          {/* Organization Card */}

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
              Welcome Back, {user?.name} 👋
              </h2>

              <p className="text-blue-100 mt-1">
                {user?.orgName}
              </p>
              <p className="text-blue-100 mt-1">
                Role: {user?.role}
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-blue-100">
                Attendance Rate Today
              </p>

              <p className="text-3xl font-bold">
                {attendanceRate}%
              </p>

            </div>

          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-white shadow rounded-xl p-6">

              <p className="text-gray-500 text-sm">
                Team Members
              </p>

              <h2 className="text-3xl font-bold">
                {totalMembers}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-6">

              <p className="text-gray-500 text-sm">
                Present Today
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                {present}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-6">

              <p className="text-gray-500 text-sm">
                Absent Today
              </p>

              <h2 className="text-3xl font-bold text-red-600">
                {absent}
              </h2>

            </div>

            <div className="bg-white shadow rounded-xl p-6">

              <p className="text-gray-500 text-sm">
                Late Entries
              </p>

              <h2 className="text-3xl font-bold text-yellow-600">
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