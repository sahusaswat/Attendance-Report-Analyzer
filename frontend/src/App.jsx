import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import ManagerDashboard from "./pages/manager/ManagerDashboard.jsx";
import SaaSDashboard from "./pages/dashboard/SaaSDashboard.jsx";
import CreateOrg from "./pages/Org/CreateOrg.jsx";
import EnterOrg from "./pages/Org/EnterOrg.jsx";
import JoinOrg from "./pages/Org/JoinOrg.jsx";
import NotAuthorized from "./pages/NotAuthorized.jsx"
import PerformancePage from "./pages/admin/PerformancePage.jsx";
import AdminAttendance from "./pages/admin/AdminAttendance.jsx";
import AdminAssignments from "./pages/admin/AdminAssignments.jsx";
import VerifyCode from "./pages/auth/VerifyCode.jsx";
import Verified from "./pages/auth/Verified.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import EditRecords from "./pages/attendance/EditRecords.jsx";
import ManagerViewAttendance from "./pages/manager/ManagerViewAttendance.jsx";
import TeamAttendance from "./pages/attendance/TeamAttendance.jsx";

function App() {
  console.log("APP MOUNTED");
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboardredirect" element={<DashboardRedirect />} />
        <Route path="/create" element={<CreateOrg />} />
        <Route path="/join" element={<JoinOrg />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/attendance" element={<AdminAttendance />} />
        <Route path="/assignments" element={<AdminAssignments />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/editrecords" element={<EditRecords />} />
        <Route path="/manager/view-attendance" element={<ManagerViewAttendance/>} />
        <Route path="/team-attendance" element={<TeamAttendance/>} />


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
