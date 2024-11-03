// recipeStore.js
import { create } from "zustand";

export const useRecipeStore = create((set) => ({
  recipes: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  searchQuery: "",
  Searching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setHasSearched: (hasSearched) => set({ hasSearched }),
  setIsSearching: (Searching) => set({ isSearching: Searching }),

  searchRecipes: async (query) => {
    set({ isLoading: true, error: null, hasSearched: true, Searching: true });

    // Simulate API call with sample data
    const sampleRecipes = [
      {
        id: 1,
        strMeal: "Mediterranean Salad",
        strCategory: "Vegetarian",
        strMealThumb: "/api/placeholder/300/200",
      },
      {
        id: 2,
        strMeal: "Grilled Salmon",
        strCategory: "Seafood",
        strMealThumb: "/api/placeholder/300/200",
      },
      {
        id: 3,
        strMeal: "Avocado Toast",
        strCategory: "Breakfast",
        strMealThumb: "/api/placeholder/300/200",
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const filteredRecipes = query.toLowerCase()
      ? sampleRecipes.filter((recipe) =>
          recipe.strMeal.toLowerCase().includes(query.toLowerCase())
        )
      : sampleRecipes;

    set({ recipes: filteredRecipes, isLoading: false, Searching: false });
  },
}));
