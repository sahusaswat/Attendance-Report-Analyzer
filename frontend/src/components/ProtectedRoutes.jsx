import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({children, role}) => {
    const {user, loading} = useAuth();

    // if(loading) return <Loader />;
    if(loading) return <p>Loading ho rhi bohot bhayankar....</p>
    if(!user) return <Navigate to="/login"/>
    if (role && user.role !== role) {
    return <Navigate to="/not-authorized" />;
  }

    return children
}

export default ProtectedRoute;