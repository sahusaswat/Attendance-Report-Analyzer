import { useState, createContext, useContext, useEffect } from "react";
import instance from "../api/axiosApi.js";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
      const getme = async () => {
        try{
        const res = await instance.get("/auth/me");
        setuser(res.data.user);
    } catch (error) {
        setuser(null);
    } finally {
        setloading(false);
    }
      }
      getme();
    }, []);

    return (
        <AuthContext.Provider value={{user, setuser, loading}}>
            {children}
        </AuthContext.Provider>
    ) ;
};

export const useAuth = () => useContext(AuthContext);