import axios from "axios";

// const BASE_URL = "http://192.168.1.15:5001/api";
// const BASE_URL = "http://localhost:5001/api";
const BASE_URL =
  import.meta.env.MODE === "developement"
    ? "http://localhost:5001/api"
    : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies for auth validation
  headers: {
    "Content-Type": "application/json",
    // Add Authorization headers here if necessary
  },
});
