import React, { useState, useEffect } from "react";
import { Heart, Search, Filter, X } from "lucide-react";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { authUser, getFavorites } = useAuthStore();
  const isLoggedIn = Boolean(authUser);

  useEffect(() => {
    try {
      const categoriesData = JSON.parse(
        localStorage.getItem("categories") ||
          "[" +
            document
              .querySelector('meta[name="categories"]')
              .getAttribute("content") +
            "]"
      );
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error parsing categories:", error);
    }
  }, []);

  // Fetch favorite IDs
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      try {
        if (!isLoggedIn) {
          const cookieFavorites = Cookies.get("favorites");
          const parsedFavorites = cookieFavorites
            ? JSON.parse(cookieFavorites)
            : [];
          setFavorites(parsedFavorites);
        } else {
          const userFavorites = getFavorites();
          setFavorites(userFavorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      }
    };

    fetchFavoriteIds();
  }, [isLoggedIn, getFavorites]);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!favorites || favorites.length === 0) {
        setIsLoading(false);
        setRecipes([]);
        return;
      }

      setIsLoading(true);
      try {
        const validRecipes = [];

        for (const id of favorites) {
          try {
            const response = await axiosInstance.get(`/recipe/${id}`);
            if (response.data && response.data.recipe) {
              validRecipes.push(response.data.recipe);
            } else if (response.data) {
              validRecipes.push(response.data);
            }
          } catch (err) {
            console.error(`Error fetching recipe ${id}:`, err);
          }
        }

        setRecipes(validRecipes.filter(Boolean));
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast.error("Failed to load some recipes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [favorites]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((catId) => catId !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelectedCategories);
  };

  // Clear all selected categories
  const clearCategories = () => {
    setSelectedCategories([]);
    localStorage.removeItem("selectedCategories");
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.data.recipeTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategories =
      selectedCategories.length === 0 ||
      recipe.data.categories.some((categoryId) =>
        selectedCategories.includes(categoryId)
      );

    return matchesSearch && matchesCategories;
  });
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#5d6544] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8 fill-white" />
                Your Favorite Recipes
              </h1>
              <p className="mt-2 text-gray-200">
                Your personally curated collection of delicious recipes
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-3xl font-bold">{filteredRecipes.length}</div>
              <div className="text-gray-200">Saved Recipes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Section */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-4 flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544] focus:border-transparent"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative z-50">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-48 py-2 px-4 border rounded-lg flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center">
                  <Filter className="mr-2 w-5 h-5 text-gray-500" />
                  <span className="text-sm">
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} categor${
                          selectedCategories.length === 1 ? "y" : "ies"
                        }`
                      : "All Categories"}
                  </span>
                </div>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCategories();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute top-full right-0 w-48 border rounded-lg bg-white shadow-lg mt-1 max-h-60 overflow-y-auto z-20"
                  role="menu"
                >
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => handleCategorySelect(category._id)}
                      className={`px-4 py-2 cursor-pointer  flex items-center text-sm ${
                        selectedCategories.includes(category._id)
                          ? "bg-[#5d6544] text-white"
                          : ""
                      }`}
                      role="menuitem"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        readOnly
                        className="mr-2 form-checkbox h-4 w-4 text-[#5d6544] rounded"
                      />
                      {category.name}
                    </div>
                  ))}
                </div>
              )}

              {/* Click Outside Handler */}
              {isDropdownOpen && (
                <div
                  onClick={() => setIsDropdownOpen(false)}
                  className="fixed inset-0 z-10 bg-transparent"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 z-0">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5d6544] mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading your favorite recipes...
            </p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              {selectedCategories.length > 0
                ? `No favorites in selected categor${
                    selectedCategories.length === 1 ? "y" : "ies"
                  }`
                : "No favorites yet"}
            </h2>
            <p className="text-gray-500">
              {selectedCategories.length > 0
                ? "Try removing some category filters"
                : "Start adding your favorite recipes to build your collection!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.data._id} recipe={recipe.data} />
            ))}
          </div>
        )}
      </div>

      {/* Click outside handler for dropdown */}
      {isDropdownOpen && (
        <div
          onClick={() => setIsDropdownOpen(false)}
          className="fixed inset-0 z-0"
        />
      )}
    </div>
  );
};

export default Favorites;
