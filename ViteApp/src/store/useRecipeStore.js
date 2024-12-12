import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRecipeStore = create((set) => ({
  recipes: [],
  categories: JSON.parse(localStorage.getItem("categories")) || [], // Check localStorage first
  isLoading: false,
  error: null,
  hasSearched: false,
  searchQuery: "",
  Searching: false,
  SearchResults: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setHasSearched: (hasSearched) => set({ hasSearched }),
  setIsSearching: (Searching) => set({ Searching }),
  SetSearchResults: (results) => set({ SearchResults }),

  searchRecipes: async (query) => {
    set({
      error: null,
      hasSearched: false,
      Searching: true,
      SearchResults: [],
    });

    try {
      // Input validation
      if (!query || query.trim() === "") {
        toast.error("Please enter a search query");
        set({
          Searching: false,
          hasSearched: false,
          error: "Empty search query",
          SearchResults: [],
        });
        return;
      }

      // API call with timeout and error handling
      const response = await axiosInstance.get("/recipe/search", {
        params: { recipeTitle: query.trim() },
      });

      // Validate response data
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response format");
      }

      const filteredRecipes = response.data.data;

      // Update state with successful search
      set({
        SearchResults: filteredRecipes,
        Searching: false,
        hasSearched: true,
        searchQuery: query,
        error: null,
      });

      // Notify if no recipes found
      if (filteredRecipes.length === 0) {
        toast.info("No recipes found. Try different search terms.");
      }
    } catch (error) {
      // Comprehensive error handling
      let errorMessage = "Something went wrong";

      if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid search request";
            break;
          case 404:
            errorMessage = "No recipes found";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage =
              error.response.data.message || "Unexpected error occurred";
        }

        console.error("API Error Response:", {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        // Request made but no response received
        errorMessage =
          "No response from server. Check your internet connection.";
        console.error("No Response Error:", error.request);
      } else if (error.code === "ECONNABORTED") {
        // Request timeout
        errorMessage = "Search took too long. Please try again.";
      } else {
        // Network or other errors
        console.error("Search Error:", error.message);
      }

      // Update state with error details
      set({
        error: errorMessage,
        Searching: false,
        hasSearched: false,
        SearchResults: [],
      });

      // Show error toast
      toast.error(errorMessage);
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
