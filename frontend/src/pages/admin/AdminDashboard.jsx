import React, { useEffect, useState } from "react";
import LogoutButton from "../../components/LogoutButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Navbar from "../../components/Navbar.jsx";
import Loader from "../../components/Loader.jsx";
import instance from "../../api/axiosApi.js";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function AdminDashboard() {

  const { user, ready } = useAuth();

  const [todaystats, setTodayStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const COLORS = ["#16a34a", "#facc15", "#ef4444"];


  const fetchStatsToday = async () => {
    try {
      const res = await instance.get("/admin/dashboard-todaystats");
      console.log("TODAY RESPONSE:", res.data);
      setTodayStats(res.data);
    } catch (error) {
      console.error("Dashboard today error:", error);
    }
  };


  const fetchStatsAnalytics = async () => {
    try {
      const res = await instance.get("/admin/dashboard-analytics-stats", {
        params: {
          startDate,
          endDate
        }
      });
      console.log("ANALYTICS RESPONSE:", res.data);
      setAnalytics(res.data);

    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  useEffect(() => {
    fetchStatsToday();
    fetchStatsAnalytics();
  }, []);

  if (!ready || !todaystats || !analytics) {
    return <Loader />;
  }
  const topPerformers = analytics?.topPerformers || [];
  const lowPerformers = analytics?.lowPerformers || [];


  const attendanceData = [
    { name: "Present", value: analytics?.present || 0 },
    { name: "Leave", value: analytics?.leave || 0 },
    { name: "Absent", value: analytics?.absent || 0 }
  ];
  const performanceData = [
    ...topPerformers.map(emp => ({
      name: emp.name,
      days: emp.presentDays
    })),
    ...lowPerformers.map(emp => ({
      name: emp.name,
      days: emp.presentDays
    }))
  ];

  return (
    <>
      <Navbar />

      <div className="ml-64 p-10 bg-gray-100 min-h-screen">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">{user?.orgName}</h1>
            <p className="mt-2">
              Code: <span className="font-semibold">{user?.orgCode}</span>
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="capitalize">{user?.role}</p>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>

        </div>

        {/* Filters */}

        <div className="bg-white p-4 rounded-lg shadow flex gap-4 items-center mb-8">

          <input
            type="date"
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={fetchStatsAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Filter
          </button>

        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Today's Attendance</h3>
            <p className="text-3xl font-bold text-green-600">
              {todaystats?.totalPresent} / {todaystats?.totalWorkers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">On Leave</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {todaystats?.leaveCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Total Workforce</h3>
            <p className="text-3xl font-bold text-blue-600">
              {todaystats?.totalWorkers}
            </p>
          </div>

        </div>

        {/* Graphs */}

        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Pie Chart */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-semibold mb-4">
              Attendance Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {attendanceData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* Bar Chart */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-semibold mb-4">
              Employee Performance
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={performanceData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="days" fill="#3b82f6" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Performer Lists */}

        <div className="grid grid-cols-2 gap-6">

          {/* Top Performers */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-semibold mb-4">
              Top Performers
            </h2>

            {topPerformers.map((emp,i)=>(
              <div key={i} className="flex justify-between bg-green-100 p-3 rounded mb-2">
                <span>{emp.name}</span>
                <span className="font-semibold">
                  {emp.presentDays} days
                </span>
              </div>
            ))}

          </div>

          {/* Low Performers */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-semibold mb-4">
              Low Performers
            </h2>

            {lowPerformers.map((emp,i)=>(
              <div key={i} className="flex justify-between bg-red-100 p-3 rounded mb-2">
                <span>{emp.name}</span>
                <span className="font-semibold">
                  {emp.presentDays} days
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;