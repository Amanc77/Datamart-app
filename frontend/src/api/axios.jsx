import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://datamart-app.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
