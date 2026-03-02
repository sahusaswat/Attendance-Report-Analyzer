import React from 'react'
import { useState, useEffect } from 'react';
import instance from '../../api/axiosApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoutButton from '../../components/LogoutButton.jsx';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useAuth()
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");
  console.log("USER:", user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await instance.get("/attendance/members");

      setMembers(res.data.members);

      // default = absent
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
  const updateManagerRole = async (userId) => {
    try {
      await instance.post("/org/add-manager", {
        orgId: user.orgId,
        userId
      });

      const res = await instance.get("/attendance/members");
      setMembers(res.data.members);

    } catch (err) {
      alert(err.response?.data?.message || "Role update failed");
    }
  };
  const assignMembers = async (managerId) => {
    try {

      const memberIds = members
        .filter(m => m.role === "member")
        .map(m => m.userId._id);

      await instance.post("/attendance/assign", {
        managerId,
        members: memberIds
      });

      alert("Members assigned successfully");

    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (attendanceDate > today) {
    alert("Holdon Youngman! The day is yet to come :P");
    return window.location.reload();;
  }
  return (
    <div>
      <h2>Mark Attendance</h2>

      <input
        type="date"
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
      />

      {members.map(m => (
        <div key={m.userId._id} className="flex gap-4 items-center m-4">

          <span>{m.userId.name}</span>
          <span>({m.role})</span>

          {/* Attendance toggle */}
          <button onClick={() => toggleAttendance(m.userId._id)}>
            {attendance[m.userId._id] === "present" ? "Present" : "Absent"}
          </button>

          {/* Promote button only for members */}
          {m.role !== "admin" && (
            <button
              onClick={() => updateManagerRole(m.userId._id)}
              className="bg-yellow-200 px-2 rounded"
            >
              {m.role === "member" ? "Make Manager" : "Remove Manager"}
            </button>
          )}
          {m.role === "manager" && (
            <button
              onClick={() => assignMembers(m.userId._id)}
              className="bg-green-200 px-2 rounded"
            >
              Assign Members
            </button>
          )}
        </div>
      ))}

      <button onClick={handleSubmit}
        className='w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-1 cursor-pointer'>
        Submit Attendance
      </button>
      <button onClick={() => navigate("/performance")}
        className='w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-1 cursor-pointer'>
        View Performance
      </button>
      <LogoutButton />
    </div>
  )
}

export default AdminDashboard
