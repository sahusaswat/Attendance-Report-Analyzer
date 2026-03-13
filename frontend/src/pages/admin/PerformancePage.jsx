import React, { useState } from "react";
import instance from "../../api/axiosApi.js";
import Navbar from "../../components/Navbar.jsx";

const PerformancePage = () => {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [excludeSat, setExcludeSat] = useState(false);
  const [excludeSun, setExcludeSun] = useState(false);
  const [data, setData] = useState([]);

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

  const reloadPage = () => {
    setStartDate("");
    setEndDate("");
    setExcludeSat(false);
    setExcludeSun(false);
    setData([]);
  };

  return (
    <>
      <Navbar />

      <div className="ml-64 p-10 min-h-screen bg-gray-100">

        {/* Page Title */}

        <h1 className="text-3xl font-bold text-gray-700 mb-8">
          Employee Performance
        </h1>

        {/* Filters */}

        <div className="bg-white shadow rounded-lg p-6 mb-8">

          <div className="grid grid-cols-4 gap-6 items-center">

            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded w-full px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-4 mt-6">

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludeSat}
                  onChange={() => setExcludeSat(!excludeSat)}
                />
                Exclude Saturday
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={excludeSun}
                  onChange={() => setExcludeSun(!excludeSun)}
                />
                Exclude Sunday
              </label>

            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={fetchPerformance}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
              >
                Load
              </button>

              <button
                onClick={reloadPage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded"
              >
                Clear
              </button>

            </div>

          </div>

        </div>


        {/* Table */}

        <div className="bg-white shadow rounded-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-200 text-left">

              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Present Days</th>
                <th className="p-4">Total Days</th>
                <th className="p-4">Late</th>
                <th className="p-4">Attendance %</th>
              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No attendance data for selected range
                  </td>
                </tr>

              ) : (

                data.map((d, i) => (

                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {d.name}
                    </td>

                    <td className="p-4">
                      {d.email}
                    </td>

                    <td className="p-4 capitalize">
                      {d.role}
                    </td>

                    <td className="p-4">
                      {d.presentDays}
                    </td>

                    <td className="p-4">
                      {d.totalDays}
                    </td>
                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold
                            ${d.lateEntries > 3
                            ? "bg-red-200 text-red-800"
                            : d.lateEntries > 0
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                          }`}
                      >

                        {d.lateEntries}

                      </span>

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold
                          ${d.percentage >= 90
                            ? "bg-green-200 text-green-800"
                            : d.percentage >= 70
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                      >
                        {d.percentage}%
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

export default PerformancePage;