import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import instance from "../../api/axiosApi";
import Navbar from "../../components/Navbar";

function AdminAttendance() {

    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [attendanceDate, setAttendanceDate] = useState("");
    const [file, setFile] = useState(null)
    const [result, setResult] = useState(null)

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
                alert("Holdon Youngman! The day is yet to come :P");
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

            alert("Attendance Submitted!");

        } catch (err) {
            console.log(err);
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
    }

    return (
        <>
            <Navbar />

            <div className="ml-64 p-10 min-h-screen bg-gray-100">

                {/* Page Header */}

                <div className="mb-8 flex justify-between items-center">

                    <h1 className="text-3xl font-bold text-gray-700">
                        Mark Attendance
                    </h1>

                    <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="border rounded px-4 py-2 shadow-sm"
                    />

                </div>

                <div className="bg-white p-4 rounded-lg shadow-md w-[450px]">

                    <h2 className="text-lg font-semibold mb-3">
                        Upload Attendance CSV
                    </h2>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="mb-3 cursor-pointer"
                    />

                    <button
                        onClick={uploadCSV}
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Upload
                    </button>

                </div>

                {result && (

                    <div className="mt-4">

                        <p>Processed: {result.success}</p>
                        <p>Skipped: {result.skipped.length}</p>

                    </div>

                )}

                {/* Attendance Table */}

                <div className="bg-white shadow rounded-lg overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-200 text-left">

                            <tr>
                                <th className="p-4">Member Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Attendance</th>
                            </tr>

                        </thead>

                        <tbody>

                            {members.map(m => {

                                const status = attendance[m.userId._id];

                                return (

                                    <tr
                                        key={m.userId._id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-4 font-medium">
                                            {m.userId.name}
                                        </td>

                                        <td className="p-4 capitalize">
                                            {m.role}
                                        </td>

                                        <td className="p-4">

                                            <button
                                                onClick={() => toggleAttendance(m.userId._id)}
                                                className={`px-4 py-1 rounded font-semibold
                                                ${status === "present"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-red-200 text-red-800"
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

                {/* Submit Button */}

                <div className="mt-8">

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded shadow"
                    >
                        Submit Attendance
                    </button>

                </div>

            </div>
        </>
    );
}

export default AdminAttendance;