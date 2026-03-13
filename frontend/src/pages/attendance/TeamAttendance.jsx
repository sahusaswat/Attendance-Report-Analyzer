import React from 'react'
import { getTeamAttendance } from '../../api/attendanceApi'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

function TeamAttendance() {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([]);

    if (!user?._id) {
        return null;
    };

    const fetchAttendance = async () => {
        if (!startDate || !endDate) {
            return toast.error("Select date range!");
        }
        try {
            setLoading(true);
            const res = await getTeamAttendance(startDate, endDate);
            setAttendance(res.attendance)
        } catch (error) {
            return toast.error(error.message)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="p-6">

                {/* Page Title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Team Attendance
                </h1>

                {/* Filter Card */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">

                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <button
                            onClick={fetchAttendance}
                            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Fetch Attendance"}
                        </button>

                    </div>

                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100 text-left">

                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Check In</th>
                                <th className="p-3">Check Out</th>
                                <th className="p-3">Entry</th>
                                <th className="p-3">Status</th>
                            </tr>

                        </thead>

                        <tbody>
                            {attendance.length === 0 && !loading && (

                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">
                                        No attendance records found
                                    </td>
                                </tr>

                            )}

                            {attendance.map((record) => (

                                <tr
                                    key={record._id}
                                    className="border-t hover:bg-gray-50">

                                    <td className="p-3">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>

                                    <td className='p-3'>
                                        {record.userId?.name || "Unknown"}
                                    </td>

                                    <td className="p-3">
                                        {record.inTime || "-"}
                                    </td>

                                    <td className="p-3">
                                        {record.outTime || "-"}
                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={`px-2 py-1 text-sm rounded ${record.status === "present" && record.lateStatus
                                                ? "bg-red-100 text-red-600"
                                                : record.status === "present"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}>
                                            {
                                                record.status === "present"
                                                    ? record.lateStatus ? "Late" : "On Time"
                                                    : record.status
                                            }
                                        </span>

                                    </td>

                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-sm ${record.status === "present"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            </div>
        </>
    )
}

export default TeamAttendance
