import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi.js";
import Navbar from "../../components/Navbar.jsx";

function AdminAssignments() {

    const [managers, setManagers] = useState([]);
    const [unassignedMembers, setUnassignedMembers] = useState([]);
    const [assignedMembers, setAssignedMembers] = useState([]);

    const [selectedManager, setSelectedManager] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        const res = await instance.get("/attendance/assignments");

        setManagers(res.data.managers);
        setUnassignedMembers(res.data.unassignedMembers);
        setAssignedMembers(res.data.assignedMembers);

    };

    // assign button
    const assignMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id)
                ? prev
                : [...prev, id]
        );
    };

    // unassign button
    const unassignMember = (id) => {

        setAssignedMembers(prev =>
            prev.filter(m => m.userId._id !== id)
        );

        const member = assignedMembers.find(m => m.userId._id === id);

        if (member) {
            setUnassignedMembers(prev => [...prev, member]);
        }

        setSelectedMembers(prev =>
            prev.filter(m => m !== id)
        );
    };

    const handleSubmit = async () => {

        if (!selectedManager) {
            alert("Select a manager first");
            return;
        }

        await instance.post("/attendance/assign", {
            managerId: selectedManager,
            members: selectedMembers
        });

        alert("Members Assigned");

        setSelectedManager("");
        setSelectedMembers([]);

        fetchData();
    };

    return (
        <>
        <Navbar/>
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
                                                Assign
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
                                                Unassign
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