import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
    const {user, loading} = useAuth();

    if(loading) return <p>Loading ho rhi bohot bhayankar....</p>;
    if(!user) return <Navigate to="/login" />;
    if(user.role === "admin") return <Navigate to="/admin" />;
    if(user.role === "member") return <Navigate to="/member" />;

    return <Navigate to="/login" />;
};

export default DashboardRedirect;