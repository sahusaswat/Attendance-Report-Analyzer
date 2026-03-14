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
  LineChart,
  Line,
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

  const COLORS = ["#01b242", "#facc15", "#e41b1b"];

  const fetchStatsToday = async () => {
    try {
      const res = await instance.get("/admin/dashboard-todaystats");
      setTodayStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatsAnalytics = async (start = startDate, end = endDate) => {
    try {

      const res = await instance.get("/admin/dashboard-analytics-stats", {
        params: {
          startDate: start,
          endDate: end
        }
      });

      setAnalytics(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    const today = new Date();
    const past = new Date();

    past.setDate(today.getDate() - 30);

    const start = past.toISOString().split("T")[0];
    const end = today.toISOString().split("T")[0];

    setStartDate(start);
    setEndDate(end);

    fetchStatsToday();
    fetchStatsAnalytics(start, end);

  }, []);

  if (!ready || !todaystats || !analytics) {
    return <Loader />;
  }

  const attendancePercentage = analytics?.attendancePercentage || 0;

  const attendanceData = [
    { name: "Present", value: Number(analytics?.attendancePercentage) || 0 },
    { name: "Leave", value: Number(analytics?.leavePercentage) || 0 },
    { name: "Absent", value: Number(analytics?.absentPercentage) || 0 }
  ];

  const trendData =
    analytics?.trend?.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-GB")
    })) || [];

  return (
    <div className="flex">

      <Navbar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-100 min-h-screen">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{user?.orgName}</h1>
            <p className="mt-1">
              Code: <span className="font-semibold">{user?.orgCode}</span>
            </p>
          </div>

          <div className="md:text-right">
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="capitalize">{user?.role}</p>
            <div className="mt-2">
              <LogoutButton />
            </div>
          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Today's Attendance</h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {todaystats?.totalPresent} / {todaystats?.totalWorkers}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Absent</h3>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              {todaystats?.absentCount}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">On Leave</h3>
            <p className="text-2xl md:text-3xl font-bold text-yellow-500">
              {todaystats?.leaveCount}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Workforce</h3>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {todaystats?.totalWorkers}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Attendance Rate</h3>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {attendancePercentage}%
            </p>
          </div>

        </div>

        {/* FILTER */}

        <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3 sm:items-center mb-8">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />

          <button
            onClick={() => fetchStatsAnalytics(startDate, endDate)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Apply Filter
          </button>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PIE CHART */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Attendance Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={(entry) => `${entry.name} ${entry.value}%`}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => `${value}%`} />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* TREND CHART */}

          <div className="bg-white p-6 rounded-lg shadow">

            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Attendance Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={trendData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;