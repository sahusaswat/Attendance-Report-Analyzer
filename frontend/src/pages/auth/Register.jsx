import React from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import instance from "../../api/axiosApi.js";
import {useAuth} from "../../context/AuthContext.jsx"

function Signup () {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [name, setname] = useState("");
    const {setuser} = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
         await instance.post("/auth/register", {
        name,
        email,
        password
      });
      const res = await instance.get("/auth/me");
      setuser(res.data.user)
      navigate("/dashboardredirect");
      } catch (error) {
        alert(error.response?.data?.message || "Signup Failed!")
      }
    };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
      <form
        className="w-96 p-6 bg-white shadow-2xl rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="w-full h-20 flex justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
        </div>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="w-full mb-3 p-2 border rounded-lg"
          value={name}
          onChange={(e)=> setname(e.target.value)}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded-lg"
          value={email}
          onChange={(e)=> setemail(e.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-lg"
          value={password}
          onChange={(e)=> setpassword(e.target.value)}
          required
        />
      <div className="w-full h-20 flex justify-center items-center">
        <button className="w-36 rounded-md bg-blue-400 text-gray-600 py-2">
          Sign up
        </button>
        </div>

        <p className="text-blue-700 underline mt-4 "><Link to="/login">Already Have an account?</Link></p>
      </form>
    </div>
    </>
  )
}

export default Signup
