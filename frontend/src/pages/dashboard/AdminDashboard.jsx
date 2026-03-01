import React from 'react'
import { useState } from 'react';
import { markAttendance } from '../../api/attendanceApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

function AdminDashboard ()  {
  const {user} = useAuth()
  const [status, setstatus] = useState("present")
  const [userId, setuserId] = useState("");
  console.log("USER:", user);
  const handleMark = async () => {
    try {
      const res = await markAttendance({
        userId,
        status,
      })

      alert(res.message)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }
  return (
    <div>
      <h1>
        I am Admin !
      </h1>

      <input
      placeholder='userId'
      value={userId}
      onChange={(e)=> setuserId(e.target.value)}
      />
      <select onChange={(e)=> setstatus(e.target.value)}>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>

      <button onClick={handleMark} className='text-purple-300 underline mt-4 cursor-crosshair'>
        Mark Attendance
        </button>

    </div>
  )
}

export default AdminDashboard
