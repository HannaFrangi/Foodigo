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

    const sampleRecipes = [
      {
        id: 1,
        strMeal: "Mediterranean Salad",
        strCategory: "Vegetarian",
        strMealThumb:
          "https://cdn.loveandlemons.com/wp-content/uploads/2019/07/salad.jpg",
      },
      {
        id: 2,
        strMeal: "Grilled Salmon Salad",
        strCategory: "Seafood",
        strMealThumb:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyi0ndisrU17sVM0cWvkv8x0eLBKNWC54Jww&s",
      },
      {
        id: 3,
        strMeal: "Avocado Toast",
        strCategory: "Breakfast",
        strMealThumb:
          "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
      },
      {
        id: 4,
        strMeal: "Avocado Toast",
        strCategory: "Breakfast",
        strMealThumb:
          "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
      },
      {
        id: 5,
        strMeal: "Avocado Toast",
        strCategory: "Breakfast",
        strMealThumb:
          "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2024-04-french-toast%2Ffrench-toast-COMP",
      },
    ];

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const filteredRecipes = query.toLowerCase()
      ? sampleRecipes.filter((recipe) =>
          recipe.strMeal.toLowerCase().includes(query.toLowerCase())
        )
      : sampleRecipes;

    set({ recipes: filteredRecipes, isLoading: false, Searching: false });
  },
}));
