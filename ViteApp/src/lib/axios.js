import axios from "axios";

// const BASE_URL = "http://192.168.1.9:5001/api";
const BASE_URL = "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies for auth validation
  headers: {
    "Content-Type": "application/json",
    // Add Authorization headers here if necessary
  },
});
