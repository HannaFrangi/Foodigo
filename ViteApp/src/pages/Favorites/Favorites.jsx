import React, { useState, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { authUser, getFavorites } = useAuthStore();
  const isLoggedIn = Boolean(authUser);

  // First, fetch favorite IDs from cookies or auth store
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

  // Then, fetch recipe details for each favorite ID
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

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.data.recipeTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search Section */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-4">
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
              No favorites yet
            </h2>
            <p className="text-gray-500">
              Start adding your favorite recipes to build your collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe.data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
