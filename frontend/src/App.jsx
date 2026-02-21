import React from "react";
import Login from "./pages/auth/Login.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import MemberDashboard from "./pages/dashboard/MemberDashboard.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<DashboardRedirect />}/>
      <Route path="/login" element={<Login/>}/>

      <Route path="/dashboardredirect" element={<DashboardRedirect/>}/>

      <Route
        path="/admin"
        element={
          <ProtectedRoutes role="admin">
            <AdminDashboard/>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/member"
        element={
          <ProtectedRoutes>
            <MemberDashboard/>
          </ProtectedRoutes>
        }
      />
    </Routes>
    </>
  )
}

export default App;
