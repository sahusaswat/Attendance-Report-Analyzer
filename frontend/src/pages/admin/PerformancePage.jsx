import React, { useState } from "react";
import instance from "../../api/axiosApi.js";
import Navbar from "../../components/Navbar.jsx";

const PerformancePage = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [excludeSat, setExcludeSat] = useState(false);
  const [excludeSun, setExcludeSun] = useState(false);
  const [data, setData] = useState([]);

  const fetchPerformance = async () => {
    try {

      const res = await instance.get("/attendance/performance", {
        params: {
          startDate,
          endDate,
          excludeSat,
          excludeSun
        }
      });

      setData(res.data);

    } catch (err) {

      alert("Failed to fetch performance");

    }
  };

  const reloadPage = () => {

    setStartDate("");
    setEndDate("");
    setExcludeSat(false);
    setExcludeSun(false);
    setData([]);

  };

  // KPI calculations

  const totalEmployees = data.length;

  const avgAttendance =
    data.length > 0
      ? Math.round(
        data.reduce((sum, d) => sum + d.percentage, 0) / data.length
      )
      : 0;

  const totalLate =
    data.reduce((sum, d) => sum + d.lateEntries, 0);

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 space-y-6">

        {/* Page Title */}

        <h1 className="text-2xl md:text-3xl font-bold mt-18 md:mt-0 text-gray-800">
          Employee Performance
        </h1>


        {/* KPI Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Employees</p>
            <h2 className="text-2xl font-bold">{totalEmployees}</h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Avg Attendance</p>
            <h2 className="text-2xl font-bold text-green-600">
              {avgAttendance}%
            </h2>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <p className="text-gray-500 text-sm">Total Late Entries</p>
            <h2 className="text-2xl font-bold text-red-600">
              {totalLate}
            </h2>
          </div>

        </div>


        {/* Filters */}

        <div className="bg-white shadow rounded-xl p-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>


            <div>
              <label className="text-sm text-gray-500 block mb-1">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>


            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={excludeSat}
                onChange={() => setExcludeSat(!excludeSat)}
              />
              <span className="text-sm text-gray-600">
                Exclude Saturday
              </span>
            </label>


            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={excludeSun}
                onChange={() => setExcludeSun(!excludeSun)}
              />
              <span className="text-sm text-gray-600">
                Exclude Sunday
              </span>
            </label>


            <div className="flex flex-col sm:flex-row gap-2">

              <button
                onClick={fetchPerformance}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Load
              </button>

              <button
                onClick={reloadPage}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg w-full"
              >
                Clear
              </button>

            </div>

          </div>

        </div>


        {/* DESKTOP TABLE */}

        <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">

          <div className="p-4 border-b flex justify-between items-center">

            <h2 className="font-semibold text-gray-700">
              Performance Report
            </h2>

            <span className="text-sm text-gray-500">
              {data.length} employees
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm text-left">

              <thead className="bg-gray-50 text-gray-600">

                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Present</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Late</th>
                  <th className="px-4 py-3">Attendance</th>
                </tr>

              </thead>

              <tbody>

                {data.length === 0 ? (

                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      No performance data found
                    </td>
                  </tr>

                ) : (

                  data.map((d, i) => (

                    <tr key={i} className="border-t hover:bg-gray-50">

                      <td className="px-4 py-3 font-medium">{d.name}</td>
                      <td className="px-4 py-3">{d.email}</td>
                      <td className="px-4 py-3 capitalize">{d.role}</td>
                      <td className="px-4 py-3">{d.presentDays}</td>
                      <td className="px-4 py-3">{d.totalDays}</td>

                      <td className="px-4 py-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${d.lateEntries > 3
                              ? "bg-red-100 text-red-700"
                              : d.lateEntries > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {d.lateEntries}
                        </span>

                      </td>

                      <td className="px-4 py-3">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${d.percentage >= 90
                              ? "bg-green-100 text-green-700"
                              : d.percentage >= 70
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {d.percentage}%
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* MOBILE CARDS */}

        <div className="md:hidden space-y-4">

          {data.length === 0 && (
            <div className="text-center text-gray-400">
              No performance data found
            </div>
          )}

          {data.map((d, i) => (

            <div
              key={i}
              className="bg-white shadow rounded-xl p-4 space-y-2"
            >

              <div className="flex justify-between">

                <span className="font-semibold">
                  {d.name}
                </span>

                <span className="text-sm text-gray-500 capitalize">
                  {d.role}
                </span>

              </div>

              <div className="text-sm text-gray-600">
                {d.email}
              </div>

              <div className="text-sm">
                Present: {d.presentDays} / {d.totalDays}
              </div>

              <div className="flex justify-between">

                <span
                  className={`px-2 py-1 text-xs rounded-full
                  ${d.lateEntries > 3
                      ? "bg-red-100 text-red-700"
                      : d.lateEntries > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  Late: {d.lateEntries}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full
                  ${d.percentage >= 90
                      ? "bg-green-100 text-green-700"
                      : d.percentage >= 70
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {d.percentage}%
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default PerformancePage;