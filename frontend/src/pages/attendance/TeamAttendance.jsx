import React, { useState } from "react";
import { getTeamAttendance } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function TeamAttendance() {

    const { user } = useAuth();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([]);

    if (!user?._id) return null;

    const fetchAttendance = async () => {

        if (!startDate || !endDate) {
            return toast.error("Select date range!");
        }

        try {

            setLoading(true);

            const res = await getTeamAttendance(startDate, endDate);

            setAttendance(res.attendance);

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="flex min-h-screen bg-gray-100">

            <Navbar />

            <div className="flex-1 md:ml-64 p-4 md:p-8 space-y-6">

                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <h1 className="text-2xl md:text-3xl font-bold mt-18 md:mt-0 text-gray-800">
                        Team Attendance
                    </h1>
                </div>

                {/* Filters */}

                <div className="bg-white shadow rounded-xl p-4">

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">

                        {/* Start Date */}
                        <div className="flex flex-col w-48">
                            <label className="text-xs text-gray-500 mb-1">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded-md px-2 py-1.5 text-sm"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col w-48">
                            <label className="text-xs text-gray-500 mb-1">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded-md px-2 py-1.5 text-sm"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={fetchAttendance}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md font-medium h-9"
                        >
                            {loading ? "Loading..." : "Generate"}
                        </button>

                    </div>

                </div>

                {/* DESKTOP TABLE */}

                <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">

                    <div className="p-4 border-b flex justify-between items-center">

                        <h2 className="text-lg font-semibold text-gray-700">
                            Attendance Records
                        </h2>

                        <span className="text-sm text-gray-500">
                            {attendance.length} records
                        </span>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full text-sm text-left">

                            <thead className="bg-gray-50 text-gray-600">

                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Check In</th>
                                    <th className="px-4 py-3">Check Out</th>
                                    <th className="px-4 py-3">Entry</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {attendance.map((record) => (

                                    <tr key={record._id} className="border-t">

                                        <td className="px-4 py-3">
                                            {new Date(record.date).toLocaleDateString("en-GB")}
                                        </td>

                                        <td className="px-4 py-3 font-medium">
                                            {record.userId?.name || "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">{record.inTime || "-"}</td>

                                        <td className="px-4 py-3">{record.outTime || "-"}</td>

                                        <td className="px-4 py-3">
                                            {record.lateStatus ? "Late" : "On Time"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {record.status}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* MOBILE CARDS */}

                <div className="md:hidden space-y-4">

                    {attendance.length === 0 && !loading && (

                        <div className="text-center text-gray-400">
                            No attendance records found
                        </div>

                    )}

                    {attendance.map((record) => (

                        <div
                            key={record._id}
                            className="bg-white shadow rounded-xl p-4 space-y-2"
                        >

                            <div className="flex justify-between">

                                <span className="font-medium">
                                    {record.userId?.name || "Unknown"}
                                </span>

                                <span className="text-sm text-gray-500">
                                    {new Date(record.date).toLocaleDateString("en-GB")}
                                </span>

                            </div>

                            <div className="text-sm text-gray-600">
                                In: {record.inTime || "-"}
                            </div>

                            <div className="text-sm text-gray-600">
                                Out: {record.outTime || "-"}
                            </div>

                            <div className="flex justify-between">

                                <span
                                    className={`text-xs px-2 py-1 rounded-full
                                    ${record.lateStatus
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {record.lateStatus ? "Late" : "On Time"}
                                </span>

                                <span
                                    className={`text-xs px-2 py-1 rounded-full
                                    ${record.status === "present"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {record.status}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default TeamAttendance;