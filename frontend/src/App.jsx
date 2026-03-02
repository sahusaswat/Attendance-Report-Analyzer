import React from "react";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import MemberDashboard from "./pages/dashboard/MemberDashboard.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard.jsx";
import { Routes, Route } from "react-router-dom";
import SaaSDashboard from "./pages/dashboard/SaaSDashboard.jsx";
import CreateOrg from "./pages/Org/CreateOrg.jsx";
import EnterOrg from "./pages/Org/EnterOrg.jsx";
import JoinOrg from "./pages/Org/JoinOrg.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx"
import PerformancePage from "./pages/PerformancePage.jsx"

function App() {
  console.log("APP MOUNTED");
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboardredirect" element={<DashboardRedirect />} />
        <Route path="/create" element={<CreateOrg />} />
        <Route path="/join" element={<JoinOrg />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/performance" element={<PerformancePage/>} />


        <Route
          path="/admin"
          element={
            <ProtectedRoutes role="admin" requireWorkspace>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoutes role="member" requireWorkspace>
              <MemberDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoutes role="manager" requireWorkspace>
              <ManagerDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <SaaSDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/my-org"
          element={
            <ProtectedRoutes>
              <EnterOrg />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  )
}

export default App;
