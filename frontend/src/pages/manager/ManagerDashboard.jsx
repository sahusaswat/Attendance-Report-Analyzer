import React, { useState, useEffect } from "react";
import instance from "../../api/axiosApi";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton";
import { Link } from "react-router-dom";

function ManagerDashboard() {

  const { user } = useAuth();

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

      alert(err.response?.data?.message || "Error submitting attendance");

    }

  };

  return (
    <>

      <div className=" p-10 min-h-screen bg-gray-100">

        {/* Organization Header */}

        <div className="bg-gradient-to-r from-blue-500 to-purple-400 text-white shadow-lg rounded-lg p-6 flex justify-between items-center mb-8">
          <div>

            <h1 className="text-3xl font-bold">
              {user?.orgName}
            </h1>

          </div>

          <div className="text-right">

            <p className="text-xl font-semibold">
              {user?.name}
            </p>

            <p className="text-gray-700 capitalize">
              {user?.role}
            </p>

            <div className="mt-3">
              <LogoutButton />
            </div>

          </div>

        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer">
          <Link to={"/manager/view-attendance"}>View-Attendance</Link>
          </button>

        {/* Attendance Section */}

        <div className="bg-white shadow rounded-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-semibold">
              Manager Attendance Panel
            </h2>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="border px-4 py-2 rounded"
            />

          </div>

          {members.length === 0 ? (

            <p className="text-gray-500">
              No members assigned yet
            </p>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-200 text-left">

                <tr>
                  <th className="p-4">Member</th>
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

          )}

          <div className="mt-6">

            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded shadow"
            >
              Submit Attendance
            </button>

          </div>

        </div>

      </div>

    </>
  );
}

export default ManagerDashboard;