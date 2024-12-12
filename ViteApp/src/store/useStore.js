// src/store/useStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools((set) => ({
    searchQuery: "",
    isLoading: false,
    recipes: [],
    error: null,
    setSearchQuery: (query) => set(() => ({ searchQuery: query })),
    setIsLoading: (loading) => set(() => ({ isLoading: loading })),
    setRecipes: (recipes) => set(() => ({ recipes })),
    setError: (error) => set(() => ({ error })),
    resetSearch: () =>
      set(() => ({
        searchQuery: "",
        isLoading: false,
        recipes: [],
        error: null,
      })),
  }))
);
