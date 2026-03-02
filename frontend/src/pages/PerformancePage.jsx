import React from 'react'
import { useState } from 'react';
import instance from "../api/axiosApi.js";
import LogoutButton from "../components/LogoutButton.jsx";

const PerformancePage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [excludeSat, setExcludeSat] = useState(false);
  const [excludeSun, setExcludeSun] = useState(false);
  const [data, setData] = useState([]);

  const reloadPage = () => {
    window.location.reload();
  };

  const fetchPerformance = async () => {
    try {

      const res = await instance.get("/attendance/performance", {
        params: {
          startDate,
          endDate,
          excludeSat,
          excludeSun
        }
      });

      setData(res.data);

    } catch (err) {
      alert("Failed to fetch performance");
    }
  };

  return (
    <div>
      <h2>Employee Performance</h2>

      {/* Filters */}
      <div>

        <label className='m-4'>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className='m-4'>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <br />

        <label>
          <input
            type="checkbox"
            checked={excludeSat}
            onChange={() => setExcludeSat(!excludeSat)}
            className='m-4'
          />
          Exclude Saturday
        </label>

        <label>
          <input
            type="checkbox"
            checked={excludeSun}
            onChange={() => setExcludeSun(!excludeSun)}
            className='m-4'
          />
          Exclude Sunday
        </label>

        <br />

        <button onClick={fetchPerformance}
          className="w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-4 cursor-pointer">
          Load Performance
        </button>

      </div>

      {/* Table */}
      <table border="1" style={{ marginTop: "20px" }} className='m-4'>
        <thead>
          <tr>
            <th className='m-4'>Name</th>
            <th className='m-4'>Email</th>
            <th className='m-4'>Role</th>
            <th className='m-4'>Present Days</th>
            <th className='m-4'>Total Days</th>
            <th className='m-4'>%</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No attendance data for selected month
              </td>
            </tr>
          ) : (data.map((d, i) => (
            <tr key={i} className='m-4'>
              <td className='m-4'>{d.name}</td>
              <td className='m-4'>{d.email}</td>
              <td className='m-4'>{d.role}</td>
              <td className='m-4'>{d.presentDays}</td>
              <td className='m-4'>{d.totalDays}</td>
              <td className='m-4'>{d.percentage}%</td>
            </tr>
          ))
          )}
        </tbody>
      </table>
      <button onClick={reloadPage}
        className="w-36 rounded-md bg-blue-200 text-gray-600 py-2 m-4 cursor-pointer"
      >
        Clear
      </button>
      <LogoutButton />

    </div>
  )
}

export default PerformancePage
