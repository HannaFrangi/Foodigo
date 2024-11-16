import React, { useState } from "react";
import { Heart, Search, Clock, ChefHat, X, Filter } from "lucide-react";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard";

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [favorites, setFavorites] = useState([
    {
      id: "1",
      recipeTitle: "Classic Margherita Pizza",
      description: "Traditional Italian pizza with fresh basil and mozzarella",
      recipeImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxgbXJj7igPnSKXcgSP2UTJT0kTYxAGrcQhQ&s",
      categories: ["6738bfdb4210d11bde43a40f"],
      prepTime: "30 mins",
      difficulty: "Medium",
      rating: 4.8,
      reviews: 245,
      bookmarked: true,
      author: {
        name: "Chef Maria",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: "2",
      recipeTitle: "Vegan Lasagna",
      description:
        "Healthy mix of quinoa, roasted vegetables, and tahini dressing",
      recipeImage:
        "https://www.crazyvegankitchen.com/wp-content/uploads/2022/12/vegan-lasagna-recipe.jpg",
      categories: ["6729fbe9c4580cf3da1182f9"],
      prepTime: "25 mins",
      difficulty: "Easy",
      rating: 4.6,
      reviews: 182,
      bookmarked: true,
      author: {
        name: "Chef Alex",
        avatar: "/api/placeholder/40/40",
      },
    },
    // Add more sample favorites...
  ]);

  const filters = [
    { id: "all", label: "All Recipes" },
    { id: "quickMeals", label: "Quick Meals" },
    { id: "desserts", label: "Desserts" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "mainCourse", label: "Main Course" },
  ];

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const filteredFavorites = favorites.filter((recipe) => {
    const matchesSearch =
      recipe.recipeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "quickMeals" && parseInt(recipe.prepTime) <= 30) ||
      (selectedFilter === "vegetarian" &&
        recipe.categories.includes("Vegetarian"));

    return matchesSearch && matchesFilter;
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
              <div className="text-3xl font-bold">{favorites.length}</div>
              <div className="text-gray-200">Saved Recipes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedFilter === filter.id
                      ? "bg-[#5d6544] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
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
            {filteredFavorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onUnfavorite={() => handleRemoveFavorite(recipe.id)}
                showUnfavorite
              />
            ))}
          </div>
        )}

        {filteredFavorites.length === 0 && favorites.length > 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No matching recipes found
            </h2>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Favorites;
