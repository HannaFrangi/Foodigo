import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../lib/socket.js";

export const useUserStore = create((set) => ({
  loading: false,
  authUser: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put("/users/update", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: res.data.user });
      toast.success("Signup successful! Welcome.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ loading: false });
    }
  },
  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  //TODO ADD THE LOGOUT BUTTON  :)
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      disconnectSocket(); // Ensure this is defined somewhere
      if (res.status === 200) set({ authUser: null });
      // Optionally clear any auth-related data from local storage/session
      localStorage.removeItem("authToken"); // If you're storing token in localStorage
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
}));
