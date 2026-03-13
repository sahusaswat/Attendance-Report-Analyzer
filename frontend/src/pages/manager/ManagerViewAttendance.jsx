import React from 'react'
import { getAttendanceByUser } from '../../api/attendanceApi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ManagerViewAttendance() {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [startDate, setstartDate] = useState("");
    const [endDate, setendDate] = useState("");
    const [loading, setloading] = useState(false);

    if (!user?._id) {
        return null
    };

    const fetchAttendance = async () => {
        if (!startDate || !endDate) {
            return toast.error("Please select the date")
        };
        try {
            setloading(true)
            const res = await getAttendanceByUser(user._id, startDate, endDate);
            setAttendance(res.attendance)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }
    return (
        <>
            <div className="p-6">

                {/* Page Title */}
                <h1 className="text-2xl font-semibold mb-6">
                    Self Attendance
                </h1>

                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link to={"/team-attendance"}>Team Attendance</Link>
          </button>

                {/* Filter Card */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">

                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setstartDate(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setendDate(e.target.value)}
                            className="border p-2 rounded"
                        />

                        <button
                            onClick={fetchAttendance}
                            className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
                        >
                            {loading ? "Loading..." : "Fetch Attendance"}
                        </button>

                    </div>

                </div>


                {/* Table Card */}

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
                                    <td colSpan="4" className="text-center p-6 text-gray-500">
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
                                        {record.userId.name}
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

                                    <td className='p-3'>
                                        {record.status}
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

export default ManagerViewAttendance
