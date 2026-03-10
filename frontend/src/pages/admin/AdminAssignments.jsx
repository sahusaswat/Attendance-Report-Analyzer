import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi.js";
import Navbar from "../../components/Navbar.jsx";

function AdminAssignments() {

    const [managers, setManagers] = useState([]);
    const [members, setMembers] = useState([]);
    const [unassignedMembers, setUnassignedMembers] = useState([]);
    const [assignedMembers, setAssignedMembers] = useState([]);

    const [selectedManager, setSelectedManager] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {

        const res = await instance.get("/attendance/assignments");
        const res2 = await instance.get("/attendance/members")

        setManagers(res.data.managers);
        setMembers(res2.data.members);
        setUnassignedMembers(res.data.unassignedMembers);
        setAssignedMembers(res.data.assignedMembers);

    };

    // assign button
    const assignMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev.filter(m => m !== id)   // undo selection
                : [...prev, id]                // mark for assignment
        );
    };

    // unassign button
    const unassignMember = (id) => {

        const member = assignedMembers.find(m => m.userId._id === id);
        if (!member) return;

        setAssignedMembers(prev =>
            prev.filter(m => m.userId._id !== id)
        );

        setUnassignedMembers(prev => [...prev, member]);

        setSelectedMembers(prev =>
            prev.filter(m => m !== id)
        );
    };

    const handleSubmit = async () => {

        if (!selectedManager) {
            alert("Select a manager first");
            return;
        }

        const currentAssignedIds = assignedMembers.map(
            m => m.userId._id
        );

        const finalMembers = [...new Set([
            ...currentAssignedIds,
            ...selectedMembers
        ])];

        await instance.post("/attendance/assign", {
            managerId: selectedManager,
            members: finalMembers
        });

        alert("Members Assigned");

        setSelectedManager("");
        setSelectedMembers([]);

        fetchData();
    };

    const updateManagerRole = async (userId) => {

        try {

            await instance.post("/org/add-manager", {
                orgId: localStorage.getItem("orgId"),
                userId
            });

            alert("Role Updated");

            fetchData();

        } catch (error) {
            alert(error.response?.data?.message);
        }

    };

    return (
        <>
            <Navbar />
            <div className="bg-white shadow rounded p-6 mb-10 ml-60">

                <h2 className="text-xl font-semibold mb-4">
                    Promote Member to Manager
                </h2>

                <table className="w-full text-left">

                    <thead className="border-b">
                        <tr>
                            <th className="p-2">Member</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {members.map(member => (

                            <tr key={member.userId._id} className="border-b">

                                <td className="p-2">
                                    {member.userId.name}
                                </td>

                                <td className="p-2">

                                    <button
                                        onClick={() => updateManagerRole(member.userId._id)}
                                        className="bg-purple-200 px-3 py-1 rounded"
                                    >

                                        {member.role === "manager" ? "Remove Manager" : "Make Manager"}

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
            <div className="ml-64 p-8 min-h-screen bg-gray-50">

                <h1 className="text-3xl font-bold mb-8">
                    Assign Members To Manager
                </h1>

                {/* Manager Selector */}

                <div className="mb-8">

                    <label className="font-semibold mr-4">
                        Select Manager:
                    </label>

                    <select
                        className="border p-2 rounded"
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                    >

                        <option value="">Choose Manager</option>

                        {managers.map(m => (
                            <option key={m.userId._id} value={m.userId._id}>
                                {m.userId.name}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="grid grid-cols-2 gap-10">

                    {/* Unassigned Members */}

                    <div className="bg-white shadow rounded p-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Unassigned Members
                        </h2>

                        <table className="w-full text-left">

                            <thead className="border-b">

                                <tr>
                                    <th className="p-2">Member</th>
                                    <th className="p-2">Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {unassignedMembers.map(member => (

                                    <tr key={member.userId._id} className="border-b">

                                        <td className="p-2">
                                            {member.userId.name}
                                        </td>

                                        <td className="p-2">

                                            <button
                                                onClick={() => assignMember(member.userId._id)}
                                                className="bg-green-200 px-3 py-1 rounded"
                                            >
                                                {selectedMembers.includes(member.userId._id) ? "Unassign" : "Assign"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>


                    {/* Assigned Members */}

                    <div className="bg-white shadow rounded p-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Assigned Members
                        </h2>

                        <table className="w-full text-left">

                            <thead className="border-b">

                                <tr>
                                    <th className="p-2">Member</th>
                                    <th className="p-2">Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {assignedMembers.map(member => (

                                    <tr key={member.userId._id} className="border-b">

                                        <td className="p-2">
                                            {member.userId.name}
                                        </td>

                                        <td className="p-2">

                                            <button
                                                onClick={() => unassignMember(member.userId._id)}
                                                className="bg-red-200 px-3 py-1 rounded"
                                            >
                                                {selectedMembers.includes(member.userId._id) ? "Assign" : "Unassign"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* Submit */}

                <div className="mt-10">

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Submit Assignment
                    </button>

                </div>

            </div>

        </>
    );
}

export default AdminAssignments;