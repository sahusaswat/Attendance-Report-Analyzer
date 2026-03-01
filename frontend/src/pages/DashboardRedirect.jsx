import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader.jsx"


const DashboardRedirect = () => {
    const {user, ready} = useAuth();
    if(!ready) return <Loader/>;
    if(!user) return <Navigate to="/login" />;
    if(!user.orgId) return <Navigate to="/dashboard" />
    switch (user.role) {
        case "admin":
            return <Navigate to="/admin" />
        case "manager":
            return <Navigate to="/manager" />
        case "member":
            return <Navigate to="/member" />
        default:
            return <Navigate to="/dashboard" />
    }
};

export default DashboardRedirect;