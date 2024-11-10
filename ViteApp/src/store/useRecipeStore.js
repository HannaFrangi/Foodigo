import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useRecipeStore = create((set) => ({
  recipes: [],
  categories: JSON.parse(localStorage.getItem("categories")) || [], // Check localStorage first
  isLoading: false,
  error: null,
  hasSearched: false,
  searchQuery: "",
  Searching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setHasSearched: (hasSearched) => set({ hasSearched }),
  setIsSearching: (Searching) => set({ Searching }),

  searchRecipes: async (query) => {
    set({ isLoading: true, error: null, hasSearched: false, Searching: true });

    try {
      const response = await axiosInstance.get(`/recipes/search`, {
        params: { query },
      });
      const filteredRecipes = response.data || [];
      set({
        recipes: filteredRecipes,
        isLoading: false,
        Searching: false,
        hasSearched: true,
        searchQuery: query,
      });
    } catch (error) {
      set({
        error: error.message || "Something went wrong.",
        isLoading: false,
        Searching: false,
        hasSearched: false,
      });
    }
  },

  LatestRecipe: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("recipe/latest/");
      const latestRecipes = response.data || [];
      set({
        recipes: latestRecipes,
        isLoading: false,
        error: null,
        hasSearched: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch the latest recipes.",
        isLoading: false,
      });
    }
  },

  // Function to fetch categories and store in localStorage
  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("category");
      const categories = response.data || [];
      // Store categories in localStorage
      localStorage.setItem("categories", JSON.stringify(categories.data));
      // console.log(categories.data);
      set({
        categories: categories.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch categories.",
        isLoading: false,
      });
    }
  },
}));
