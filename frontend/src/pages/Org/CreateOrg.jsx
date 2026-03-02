import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import instance from '../../api/axiosApi'
import { Link, useNavigate } from 'react-router-dom'

function CreateOrg() {
  const [name, setname] = useState("");
  const navigate = useNavigate();
  const { setuser } = useAuth();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await instance.post("/org/create", { name });

      const res = await instance.get("/auth/me");
      setuser({
        ...res.data.user,
        orgId: res.data.orgId,
        role: res.data.role
      });
      navigate("/dashboard")
    } catch (error) {
      alert(error.response?.data.message || 'Organization Creation Failed!')
    }
  }
  return (
    <>
      <h1>Create Your Organization</h1>
      <p>Manage attendance single handlely. Keep eye on everything.</p>

      <form className="w-96 p-6 bg-white shadow-2xl rounded-lg"
        onSubmit={handleCreate}>
        <div className="w-full h-20 flex justify-center items-center">
          <h2 className="text-2xl font-semibold mb-4">Create Organization</h2>
        </div>
        <input type="text"
          required
          placeholder='Organization Name'
          value={name}
          onChange={(e) => setname(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />

        <button className="text-purple-300 underline mt-4">Create</button>

      </form>
      <button className="text-purple-600 underline mt-4 h-10 w-40 bg-blue-200 rounded-md shadow-2xs cursor-pointer"><Link to="/dashboardredirect">Dashboard</Link></button>
    </>
  )
}

export default CreateOrg
