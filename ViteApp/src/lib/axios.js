import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Local backend URL during development

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies for auth validation
  headers: {
    "Content-Type": "application/json",
    // Add Authorization headers here if necessary
  },
});
