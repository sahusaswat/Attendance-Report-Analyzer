import React from 'react'
import { useState } from 'react';
import { markAttendance } from '../../api/attendanceApi.js';

function AdminDashboard ()  {
  const [status, setstatus] = useState("present")
  const [userId, setuserId] = useState("");

  const handleMark = async () => {
    try {
      const res = await markAttendance({
        userId,
        status
      })

      alert(res)
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

      <button onClick={handleMark}>
        Mark Attendance
        </button>

    </div>
  )
}

export default AdminDashboard
