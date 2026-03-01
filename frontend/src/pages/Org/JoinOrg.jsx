import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import instance from '../../api/axiosApi'
import { useNavigate } from 'react-router-dom'

function JoinOrg () {
    const [code, setcode] = useState("");
    const {setuser} = useAuth();
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault;

        try{
            await instance.post("/org/join", {code});
            const res = await instance.get("/auth/me");
            setuser(res.data.user);
            navigate("/enter-org");
        } catch (error) {
            alert("Joining Failed Invalid Code")
        }
    }
  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleJoin} className="p-6 shadow-lg rounded">

        <h2 className="text-xl mb-4">Join Organization</h2>

        <input
          value={code}
          onChange={(e) => setcode(e.target.value)}
          placeholder="Org Code"
          className="border p-2 w-full mb-4"
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Join
        </button>

      </form>
    </div>
    </>
  )
}

export default JoinOrg
