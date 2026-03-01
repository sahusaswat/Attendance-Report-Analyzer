import { useState, createContext, useContext, useEffect } from "react";
import instance from "../api/axiosApi.js";

const AuthContext = createContext();
console.log("AUTH PROVIDER RENDER");
export const AuthProvider = ({children}) => {
    const [user, setuser] = useState(undefined)
    const [ready, setready] = useState(false)

    useEffect(() => {
      const getme = async () => {
        try{
        const res = await instance.get("/auth/me");
        setuser(res.data.user || null);
    } catch (error) {
        setuser(null);
    } finally {
        setready(true);
    }
      }
      getme();
    }, []);

    const logout = async () => {
        await instance.post("/auth/logout");
        setuser(null);
    }

    return (
        <AuthContext.Provider value={{user, setuser, ready, logout}}>
            {children}
        </AuthContext.Provider>
    ) ;
};

export const useAuth = () => useContext(AuthContext);