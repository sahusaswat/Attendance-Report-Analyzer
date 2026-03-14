import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import instance from "../../api/axiosApi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function EditRecords() {

    const [records, setRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "member") {
            toast.error("Access denied");
            navigate("/dashboard");
        }
    }, [user]);


    const fetchAttendance = async () => {
        if (!date) {
            return toast.error("Please select a date!")
        }
        try {
            setLoading(true)
            const res = await instance.get("/attendance/date", {
                params: { date }
            });

            setRecords(res.data.attendance);

        } catch (error) {

            console.log("Error fetching attendance:", error);

        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (record) => {

        setSelectedAttendance(record);
        setStatus(record.status);
        setShowModal(true);

    };

    const updateAttendance = async () => {

        try {

            await instance.put(`/attendance/update/${selectedAttendance._id}`, {
                status
            });

            toast.success("Attendance updated successfully");

            setShowModal(false);

            fetchAttendance();

        } catch (error) {

            toast.error("Update failed");

        }

    };

    const deleteAttendance = async (id) => {

        if (!window.confirm("Delete this attendance record?")) return;

        try {

            await instance.delete(`/attendance/delete/${id}`);

            toast.success("Attendance deleted");

            fetchAttendance();

        } catch (error) {

            toast.error("Delete failed");

        }

    };

    return (
        <>
            <Navbar />

            <div className="ml-64 p-10 min-h-screen bg-gray-100">

                <h1 className="text-3xl font-bold text-gray-700 mb-8">
                    Manage Attendance
                </h1>

                {/* Date Filter */}

                <div className="flex gap-4 mb-6">

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <button
                        onClick={fetchAttendance}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Load Attendance
                    </button>

                </div>

                {/* Table */}

                <div className="bg-white shadow rounded-lg overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-200 text-left">

                            <tr>
                                <th className="p-4">Employee</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loading && (
                                <tr>
                                    <td className="p-4" colSpan="4">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && records.length === 0 && (
                                <tr>
                                    <td className="p-4 text-gray-500" colSpan="4">
                                        No attendance records found
                                    </td>
                                </tr>
                            )}

                            {records.map((r) => (

                                <tr
                                    key={r._id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4 font-medium">
                                        {r.userId?.name}
                                    </td>

                                    <td className="p-4">
                                        {new Date(r.date).toLocaleDateString("en-IN")}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {r.status}
                                    </td>

                                    <td className="p-4 flex gap-4">

                                        <button
                                            onClick={() => openEditModal(r)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteAttendance(r._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* Edit Modal */}

                {showModal && (

                    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

                        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

                            <h2 className="text-lg font-semibold mb-4">
                                Edit Attendance
                            </h2>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border w-full p-2 rounded mb-4"
                            >

                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="leave">Leave</option>

                            </select>

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={updateAttendance}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Update
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}

export default EditRecords;