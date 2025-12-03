import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;