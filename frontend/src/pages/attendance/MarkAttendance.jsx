import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi";
import Navbar from "../../components/Navbar";

function AdminAttendance() {

    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [attendanceDate, setAttendanceDate] = useState("");
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {

        const fetchMembers = async () => {

            const res = await instance.get("/attendance/members");

            setMembers(res.data.members);

            const defaultAttendance = {};

            res.data.members.forEach(m => {
                defaultAttendance[m.userId._id] = "absent";
            });

            setAttendance(defaultAttendance);

        };

        fetchMembers();

    }, []);

    const toggleAttendance = (id) => {

        setAttendance(prev => ({
            ...prev,
            [id]: prev[id] === "present" ? "absent" : "present"
        }));

    };

    const handleSubmit = async () => {

        try {

            const today = new Date().toISOString().split("T")[0];

            if (attendanceDate > today) {
                alert("Date cannot be in the future");
                return;
            }

            const attendanceList = Object.keys(attendance).map(userId => ({
                userId,
                status: attendance[userId]
            }));

            await instance.post("/attendance/mark-bulk", {
                attendanceList,
                date: attendanceDate
            });

            alert("Attendance Submitted");

        } catch (err) {

            console.log(err);

        }

    };

    const uploadCSV = async () => {

        if (!file) {
            alert("Please select a CSV file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await instance.post(
            "/attendance/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        setResult(res.data);

    };

    const downloadAttendance = async () => {

        const res = await instance.get(
            "/attendance/download",
            { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));

        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "attendance-report.csv");

        document.body.appendChild(link);
        link.click();

    };

    return (

        <div className="flex min-h-screen bg-gray-100">

            <Navbar />

            <div className="flex-1 md:ml-64 p-4 md:p-8">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Attendance Management
                    </h1>

                </div>

                {/* ACTION TOOLS */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                    {/* Upload CSV */}

                    <div className="bg-white p-5 md:p-6 rounded-xl shadow">

                        <h3 className="font-semibold mb-3">
                            Upload CSV
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-3">

                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="border rounded px-3 py-2 w-full"
                            />

                            <button
                                onClick={uploadCSV}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                            >
                                Upload
                            </button>

                        </div>

                    </div>


                    {/* Download */}

                    <div className="bg-white p-5 md:p-6 rounded-xl shadow">

                        <h3 className="font-semibold mb-3">
                            Download Report
                        </h3>

                        <button
                            onClick={downloadAttendance}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                        >
                            Download CSV
                        </button>

                    </div>

                </div>


                {/* TABLE */}

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-b">

                        <h3 className="font-semibold text-gray-700">
                            Mark Attendance
                        </h3>

                        <div className="flex items-center gap-2">

                            <span className="text-sm text-gray-500">
                                Date
                            </span>

                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                className="border px-3 py-1 rounded-lg"
                            />

                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="p-4 text-left">
                                        Member
                                    </th>

                                    <th className="p-4 text-left">
                                        Role
                                    </th>

                                    <th className="p-4 text-left">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {members.map(m => {

                                    const status = attendance[m.userId._id];

                                    return (

                                        <tr
                                            key={m.userId._id}
                                            className="border-b"
                                        >

                                            <td className="p-4">
                                                {m.userId.name}
                                            </td>

                                            <td className="p-4 capitalize">
                                                {m.role}
                                            </td>

                                            <td className="p-4">

                                                <button
                                                    onClick={() =>
                                                        toggleAttendance(m.userId._id)
                                                    }
                                                    className={`px-4 py-1 rounded-full text-sm font-semibold
                                                    ${status === "present"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >

                                                    {status === "present"
                                                        ? "Present"
                                                        : "Absent"}

                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* SUBMIT */}

                <div className="mt-8">

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow w-full sm:w-auto"
                    >
                        Submit Attendance
                    </button>

                </div>

            </div>

        </div>

    );
}

export default AdminAttendance;