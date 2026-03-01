import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader.jsx"

const ProtectedRoute = ({ children, role, requireWorkspace = false }) => {
  const { user, ready } = useAuth();
  if (!ready) return <Loader />;
  if (!user) return <Navigate to="/login" />

  const workspaceToken = localStorage.getItem("workspaceToken");
  if (requireWorkspace && !workspaceToken) {
    return <Navigate to="/my-org" />;
  }
  if (requireWorkspace && workspaceToken) {
    try {
      const payload = JSON.parse(atob(workspaceToken.split(".")[1]));

      if (role && payload.role !== role) {
        return <Navigate to="/not-authorized" />;
      }
    } catch (err) {
      return <Navigate to="/login" />;
    };
  }
  return children;

}

export default ProtectedRoute;