import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader.jsx"

const ProtectedRoute = ({ children, role, requireWorkspace = false }) => {
  const { user, ready } = useAuth();
  if (!ready) return <Loader />;
  if (!user) return <Navigate to="/login" />
  return children;
}

export default ProtectedRoute;