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
    const [file, setFile] = useState(null)
    const [result, setResult] = useState(null)

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

    const uploadCSV = async () => {
        if (!file) {
            alert("Please choose a file!")
            return
        };

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await instance.post("/attendance/upload", formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            setResult(res.data)
            alert("CSV uploaded successfully!")

        } catch (error) {
            alert("Upload Failed")
        }
    };

    const downloadAttendance = async () => {
        try {
            const res = await instance.get("/attendance/download", {
                responseType: Blob
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "attendance-report.csv");

            document.body.appendChild(link);
            link.click();
        } catch (error) {

        }
    }

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="ml-64 p-6">

                {/* Header */}

                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Team Attendance
                </h1>

                {/* Filters */}

                <div className="bg-white shadow rounded-xl p-6 mb-6">

                    <div className="flex flex-wrap items-end gap-4">

                        <div>

                            <label className="block text-sm text-gray-500 mb-1">
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

                            <label className="block text-sm text-gray-500 mb-1">
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
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            {loading ? "Loading..." : "Generate Report"}
                        </button>

                    </div>

                </div>

                {/* Attendance Table */}

                <div className="bg-white shadow rounded-xl overflow-hidden">

                    <div className="p-4 border-b">

                        <h2 className="text-lg font-semibold text-gray-700">
                            Attendance Records
                        </h2>

                    </div>

                    <table className="w-full text-left">

                        <thead className="bg-gray-100 text-gray-700">

                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Employee</th>
                                <th className="p-3">Check In</th>
                                <th className="p-3">Check Out</th>
                                <th className="p-3">Entry</th>
                                <th className="p-3">Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {attendance.length === 0 && !loading && (

                                <tr>

                                    <td colSpan="6" className="text-center p-6 text-gray-400">
                                        No attendance records found for selected dates
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

                                    <td className="p-3 font-medium">
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
                                            className={`px-3 py-1 text-sm rounded-full
                        ${record.status === "present" && record.lateStatus
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

                                    <td className="p-3">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm
                        ${record.status === "present"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {record.status}
                                        </span>

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

export default TeamAttendance;