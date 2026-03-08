import React, { useEffect, useState } from "react";
import { getAttendanceByUser } from "../../api/attendanceApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LogoutButton from "../../components/LogoutButton.jsx";

function MemberDashboard() {
  const { user } = useAuth();
  const [attendance, setattendance] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAttendance = async () => {
      try {
        const res = await getAttendanceByUser(user._id);
        console.log("FRONTEND RESPONSE:", res);
        setattendance(res.attendance);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchAttendance();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Member Dashboard
        </h1>

        <LogoutButton />
      </div>

      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-700">
          Welcome, {user?.name}
        </h2>
        <p className="text-gray-500 mt-1">
          Here is your attendance record.
        </p>
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
                    {new Date(a.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        a.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default MemberDashboard;