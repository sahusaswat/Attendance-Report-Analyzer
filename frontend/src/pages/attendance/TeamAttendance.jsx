import React, { useState } from "react";
import { getTeamAttendance } from "../../api/attendanceApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import instance from "../../api/axiosApi";

function TeamAttendance() {

    const { user } = useAuth();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

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
            alert("Please choose a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {

            const res = await instance.post("/attendance/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setResult(res.data);

            alert("CSV uploaded successfully!");

        } catch (error) {

            alert("Upload Failed");

        }

    };

    const downloadAttendance = async () => {

        try {

            const res = await instance.get("/attendance/download", {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", "attendance-report.csv");

            document.body.appendChild(link);
            link.click();

        } catch (error) {

            toast.error("Download failed");

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Navbar />

            <div className="flex-1 md:ml-64 p-4 md:p-8 space-y-6">

                {/* Header */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Team Attendance
                    </h1>

                    <button
                        onClick={downloadAttendance}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium w-full md:w-auto"
                    >
                        Download CSV
                    </button>

                </div>


                {/* Filters */}

                <div className="bg-white shadow rounded-xl p-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                        <div>

                            <label className="block text-sm text-gray-500 mb-1">
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

                            <label className="block text-sm text-gray-500 mb-1">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                        </div>

                        <button
                            onClick={fetchAttendance}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium w-full"
                        >
                            {loading ? "Loading..." : "Generate Report"}
                        </button>

                        <div className="flex flex-col sm:flex-row gap-2">

                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <button
                                onClick={uploadCSV}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                            >
                                Upload
                            </button>

                        </div>

                    </div>

                </div>


                {/* Attendance Table */}

                <div className="bg-white shadow rounded-xl overflow-hidden">

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

                                {attendance.length === 0 && !loading && (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-10 text-gray-400"
                                        >
                                            No attendance records found
                                        </td>

                                    </tr>

                                )}

                                {attendance.map((record) => (

                                    <tr
                                        key={record._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-3">
                                            {new Date(record.date).toLocaleDateString("en-GB")}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            {record.userId?.name || "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {record.inTime || "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {record.outTime || "-"}
                                        </td>

                                        <td className="px-4 py-3">

                                            <span
                                                className={`px-3 py-1 text-xs rounded-full
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

                                        <td className="px-4 py-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs
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

        </div>

    );

}

export default TeamAttendance;