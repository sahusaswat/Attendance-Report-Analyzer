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

      setAttendance(res.attendance);

    } catch (error) {

      toast.error(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="ml-64 p-6">

        {/* Page Title */}

        <h1 className="text-2xl font-semibold mb-6">
          My Attendance
        </h1>

        {/* Filter Card */}

        <div className="bg-white shadow rounded-xl p-6 mb-6">

          <div className="flex flex-wrap gap-4 items-end">

            <div>

              <label className="text-sm text-gray-500 block mb-1">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
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
                className="border rounded-lg px-3 py-2"
              />

            </div>

            <button
              onClick={fetchAttendance}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Loading..." : "View Report"}
            </button>

          </div>

        </div>

        {/* Attendance Table */}

        <div className="bg-white shadow rounded-xl overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-gray-700">

              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Check In</th>
                <th className="p-3">Check Out</th>
                <th className="p-3">Entry</th>
                <th className="p-3">Status</th>
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

                  <td className="p-3">
                    {new Date(record.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3">
                    {record.inTime || "-"}
                  </td>

                  <td className="p-3">
                    {record.outTime || "-"}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                        ${
                          record.status === "present" && record.lateStatus
                            ? "bg-red-100 text-red-700"
                            : record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {record.status === "present"
                        ? record.lateStatus
                          ? "Late"
                          : "On Time"
                        : record.status}
                    </span>

                  </td>

                  <td className="p-3 capitalize">
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