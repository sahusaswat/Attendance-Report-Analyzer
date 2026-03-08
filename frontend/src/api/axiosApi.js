import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Response Interceptor (Global Error Handler) 
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
           console.log("Unauthorized - redirecting to login");
        }
        return Promise.reject(error)
    } 
);


export default instance;