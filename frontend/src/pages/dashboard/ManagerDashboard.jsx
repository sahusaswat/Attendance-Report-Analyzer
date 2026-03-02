import React from 'react'
import { useState, useEffect } from 'react';
import instance from '../../api/axiosApi';
import LogoutButton from '../../components/LogoutButton'

function ManagerDashboard() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");

  useEffect(() => {
  const fetchMembers = async () => {
    try {

      const res = await instance.get("/attendance/members");

      const members = res.data?.members || [];

      setMembers(members);

      const defaultAttendance = {};

      members.forEach(m => {
        defaultAttendance[m.userId._id] = "absent";
      });

      setAttendance(defaultAttendance);

    } catch (err) {
      console.log("Manager fetch error:", err);
      setMembers([]);
      setAttendance({});
    }
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
      alert(err.response?.data?.message || "Error submitting attendance");
    }
  };
  const today = new Date().toISOString().split("T")[0];

  if (attendanceDate > today) {
    alert("Holdon Youngman! The day is yet to come :P");
    return window.location.reload();;
    
  }
  return (
    <div>
      <h2>Manager Attendance Panel</h2>
      <input
        type="date"
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
      />
      {members.length === 0 && <p>No members assigned yet</p>}
      {members.map(m => (
        <div key={m.userId._id}>
          <span>{m.userId.name}</span>

          <button onClick={() => toggleAttendance(m.userId._id)}>
            {attendance[m.userId._id] === "present" ? "Present" : "Absent"}
          </button>
        </div>
      ))}

      <button onClick={handleSubmit}
      className='text-purple-600  mt-4 h-10 w-40 bg-blue-200 rounded-md shadow-2xs cursor-pointer'>
        Submit Attendance
      </button>
      <LogoutButton />
    </div>
  )
}

export default ManagerDashboard
