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

// Attach workspace token automatically 
instance.interceptors.request.use((config) => {

  const workspaceToken = localStorage.getItem("workspaceToken");

  if (workspaceToken) {
    config.headers.Authorization = `Bearer ${workspaceToken}`;
  }

  return config;
});


export default instance;