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

      const user = { ...data.user };
      delete user.password;

      set({ authUser: user });
      localStorage.setItem("user-info", JSON.stringify(user));
    } catch (error) {
      set({ authUser: null });
      localStorage.removeItem("user-info");
      console.error(error?.response?.data?.message || "Authentication failed");
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
      const { user } = data;
      delete user.password;

      set({ authUser: user });
      localStorage.setItem("user-info", JSON.stringify(user));
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
      Cookies.remove("jwt_token");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  forgotPassword: async (email) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset link Sent To Your Email !");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send reset link"
      );
    }
  },

  toggleFavorite: async (recipeId) => {
    const { authUser } = useAuthStore.getState();
    try {
      set({ loading: true });

      if (!authUser) {
        const favorites = JSON.parse(Cookies.get("favorites") || "[]");
        const isCurrentlyFavorited = favorites.includes(recipeId);

        const updatedFavorites = isCurrentlyFavorited
          ? favorites.filter((id) => id !== recipeId)
          : [...favorites, recipeId];

        Cookies.set("favorites", JSON.stringify(updatedFavorites), {
          expires: 7,
          sameSite: "Strict",
        });

        toast.success(
          isCurrentlyFavorited
            ? "Recipe removed from favorites"
            : "Recipe added to favorites"
        );
        return;
      }

      const isCurrentlyFavorited = authUser.recipeFavorites?.includes(recipeId);
      const endpoint = "/users/addtofavorites";

      await axiosInstance.put(endpoint, { recipeId });

      set((state) => ({
        authUser: {
          ...state.authUser,
          recipeFavorites: isCurrentlyFavorited
            ? state.authUser.recipeFavorites.filter((id) => id !== recipeId)
            : [...(state.authUser.recipeFavorites || []), recipeId],
        },
      }));

      toast.success(
        isCurrentlyFavorited
          ? "Recipe removed from favorites"
          : "Recipe added to favorites"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update favorites"
      );
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getFavorites: () => {
    const { authUser } = useAuthStore.getState();
    if (authUser) {
      return authUser.recipeFavorites || [];
    }
    try {
      return JSON.parse(Cookies.get("favorites") || "[]");
    } catch (error) {
      console.error("Error parsing favorites cookie:", error);
      return [];
    }
  },
}));
