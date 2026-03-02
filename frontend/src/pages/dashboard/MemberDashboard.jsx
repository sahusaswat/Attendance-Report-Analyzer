import React from 'react'
import { useEffect, useState } from 'react';
import { getAttendanceByUser } from '../../api/attendanceApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import LogoutButton from '../../components/LogoutButton.jsx';

function MemberDashboard () {
  const {user} = useAuth();
  const [attendance, setattendance] = useState([])

  useEffect(() => {
    if (!user?._id) return;
    const fetchAttendance = async () => {
      try {
        const res = await getAttendanceByUser(user._id);
        console.log("FRONTEND RESPONSE:", res);
        setattendance(res.attendance)
      } catch (error) {
        console.log(error.response?.data)
      }
    };

    fetchAttendance();
  }, [user])
  

  return (
    <div>
      <h1>I am Member!</h1>

      <ul>
        {attendance.map((a)=> (
          <li key={a._id}>
            {a.date} - {a.status}
          </li>
        ))}
      </ul>
      <LogoutButton/>
    </div>
  )
}

export default MemberDashboard
