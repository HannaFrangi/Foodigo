import { create } from "zustand";
import Cookies from "js-cookie";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: JSON.parse(localStorage.getItem("user-info")) || null,
  loading: false,

  checkAuth: async () => {
    try {
      set({ loading: true });
      const { data } = await axiosInstance.get("/auth/me");
      set({ authUser: data.user });
      toast.success("Authenticated successfully");
    } catch (error) {
      set({ authUser: null });
      toast.error(error?.response?.data?.message || "Authentication failed");
    } finally {
      set({ loading: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      const { data: updatedUser } = await axiosInstance.put(
        "/users/update",
        data
      );
      set({ authUser: updatedUser.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  signup: async (userData) => {
    try {
      const { data } = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: data.user });
      localStorage.setItem("user-info", JSON.stringify(data.user));
      toast.success("Signup successful! Welcome.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  },

  login: async (loginData) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: data.user });
      localStorage.setItem("user-info", JSON.stringify(data.user));
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("user-info");
      Cookies.remove("jwt_token"); // Optionally remove JWT cookie on logout
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
}));
