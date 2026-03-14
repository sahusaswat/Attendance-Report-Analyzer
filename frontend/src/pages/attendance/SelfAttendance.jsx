import React, { useState } from "react";
import { getAttendanceByUser } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function SelfAttendance() {

  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user?._id) return null;

  const fetchAttendance = async () => {

    if (!startDate || !endDate) {
      return toast.error("Please select both dates");
    }

    try {

      setLoading(true);
      const res = await getAttendanceByUser(user._id, startDate, endDate);
      console.log("API RESPONSE:", res);
      setAttendance(res.attendance);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }

  };

  const entryStyle = (record) => {
    if (record.status === "present" && record.lateStatus)
      return "bg-red-100 text-red-600";

    if (record.status === "present")
      return "bg-green-100 text-green-600";

    return "bg-gray-100 text-gray-600";
  };

  const entryText = (record) => {
    if (record.status === "present")
      return record.lateStatus ? "Late" : "On Time";

    return record.status;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex-1 md:ml-64 p-4 md:p-8">

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-semibold mt-16 md:mt-0 mb-6">
          My Attendance
        </h1>

        {/* Filter Section */}

        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6">

          <div className="flex flex-col md:flex-row gap-4 items-end">

            <div className="flex flex-col w-full">

              <label className="text-sm text-gray-500 mb-1">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div className="flex flex-col w-full">

              <label className="text-sm text-gray-500 mb-1">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <button
              onClick={fetchAttendance}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
            >
              {loading ? "Loading..." : "View Report"}
            </button>

          </div>

        </div>

        {/* MOBILE VIEW (Cards) */}

        <div className="grid gap-4 md:hidden">

          {attendance.length === 0 && !loading && (
            <div className="text-center text-gray-400 bg-white p-6 rounded-xl shadow">
              No attendance records found
            </div>
          )}

          {attendance.map((record) => (

            <div
              key={record._id}
              className="bg-white rounded-xl shadow p-4 space-y-2"
            >

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Date</span>

                <span className="font-medium">
                  {new Date(record.date).toLocaleDateString("en-IN")}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Check In</span>

                <span>{record.inTime || "-"}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Check Out</span>

                <span>{record.outTime || "-"}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Entry</span>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${entryStyle(record)}`}
                >
                  {entryText(record)}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">Status</span>

                <span className="capitalize">{record.status}</span>

              </div>

            </div>

          ))}

        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

          <table className="min-w-full text-left">

            <thead className="bg-gray-100 text-gray-700 text-sm">

              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Check Out</th>
                <th className="p-4">Entry</th>
                <th className="p-4">Status</th>
              </tr>

            </thead>

            <tbody>

              {attendance.length === 0 && !loading && (

                <tr>

                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No attendance records found
                  </td>

                </tr>

              )}

              {attendance.map((record) => (

                <tr
                  key={record._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {new Date(record.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-4">{record.inTime || "-"}</td>

                  <td className="p-4">{record.outTime || "-"}</td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${entryStyle(record)}`}
                    >
                      {entryText(record)}
                    </span>

                  </td>

                  <td className="p-4 capitalize">
                    {record.status}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );

}

export default SelfAttendance;