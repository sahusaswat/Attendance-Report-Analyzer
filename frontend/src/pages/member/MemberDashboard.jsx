import React, { useEffect, useState } from "react";
import { getAttendanceByUser } from "../../api/attendanceApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LogoutButton from "../../components/LogoutButton.jsx";
import { toast } from "react-toastify";

function MemberDashboard() {
  const { user } = useAuth();
  const [attendance, setattendance] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("")

  if (!user?._id) return;

  const fetchAttendance = async () => {
    if (!startDate || !endDate) {
      return toast.error("Please select date!")
    }
    try {
      const res = await getAttendanceByUser(user._id, startDate, endDate);
      setattendance(res.attendance);
    } catch (error) {
      toast.error(error.message)
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-white shadow-xl w-fullscreen h-18 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Member Dashboard
        </h1>

        <LogoutButton />
      </div>
      <div className="p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-400 text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, {user?.name} 👋
            </h2>

            <p className="text-blue-100 mt-1">
              Here is your attendance overview.
            </p>
          </div>

        </div>

        {/* Date Range with Button */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap items-center gap-4">

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchAttendance}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            View Report
          </button>

        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-700">
              Attendance History
            </h3>
          </div>

          <table className="w-full text-left">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-gray-600">Date</th>
                <th className="p-3 text-gray-600">Status</th>
                <th className="p-3 text-gray-600">Entry</th>
              </tr>
            </thead>

            <tbody>

              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((a) => (
                  <tr key={a._id} className="border-t">

                    <td className="p-3">
                      {new Date(a.date).toLocaleDateString("en-IN")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${a.status === "present"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    {/* Late Status */}

                    <td className="p-3">

                      {a.lateStatus ? (

                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                          Late
                        </span>

                      ) : (

                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          On Time
                        </span>

                      )}

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;