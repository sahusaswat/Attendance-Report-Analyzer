import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi.js";
import Navbar from "../../components/Navbar.jsx";
import { toast } from "react-toastify";

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
    const res2 = await instance.get("/attendance/members");

    setManagers(res.data.managers);
    setMembers(res2.data.members);
    setUnassignedMembers(res.data.unassignedMembers);
    setAssignedMembers(res.data.assignedMembers);

  };

  const assignMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

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
      toast.error("Select a manager first");
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

   toast.success("Members Assigned");

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

      toast.success("Role Updated");

      fetchData();

    } catch (error) {

      toast.error(error.response?.data?.message);

    }

  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex-1 md:ml-64 p-4 md:p-8 space-y-8">

        {/* Page Title */}

        <h1 className="text-2xl md:text-3xl font-bold mt-18 md:mt-0 text-gray-800">
          Team Management
        </h1>


        {/* Promote Manager */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Promote Member to Manager
          </h2>

          <div className="overflow-x-auto">

            <table className="min-w-full text-sm text-left">

              <thead className="bg-gray-50 text-gray-600">

                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Role Action</th>
                </tr>

              </thead>

              <tbody>

                {members.map(member => (

                  <tr
                    key={member.userId._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 font-medium">
                      {member.userId.name}
                    </td>

                    <td className="px-4 py-3">

                      <button
                        onClick={() =>
                          updateManagerRole(member.userId._id)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium
                        ${member.role === "manager"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                      >
                        {member.role === "manager"
                          ? "Remove Manager"
                          : "Make Manager"}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* Manager Selector */}

        <div className="bg-white rounded-xl shadow-sm p-6">

          <label className="block text-sm font-medium text-gray-600 mb-2">
            Select Manager
          </label>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
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


        {/* Assignment Board */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Available Members */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">
                Available Members
              </h2>

              <span className="text-sm text-gray-500">
                {unassignedMembers.length}
              </span>

            </div>

            <div className="space-y-3">

              {unassignedMembers.map(member => (

                <div
                  key={member.userId._id}
                  className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50"
                >

                  <span className="font-medium">
                    {member.userId.name}
                  </span>

                  <button
                    onClick={() => assignMember(member.userId._id)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm hover:bg-green-200"
                  >

                    {selectedMembers.includes(member.userId._id)
                      ? "Undo"
                      : "Assign"}

                  </button>

                </div>

              ))}

            </div>

          </div>


          {/* Assigned Members */}

          <div className="bg-white rounded-xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">
                Assigned Members
              </h2>

              <span className="text-sm text-gray-500">
                {assignedMembers.length}
              </span>

            </div>

            <div className="space-y-3">

              {assignedMembers.map(member => (

                <div
                  key={member.userId._id}
                  className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-gray-50"
                >

                  <span className="font-medium">
                    {member.userId.name}
                  </span>

                  <button
                    onClick={() =>
                      unassignMember(member.userId._id)
                    }
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                  >
                    Unassign
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* Submit Button */}

        <div className="flex justify-end">

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            Save Assignment
          </button>

        </div>

      </div>

    </div>

  );

}

export default AdminAssignments;